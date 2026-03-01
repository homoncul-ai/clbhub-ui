import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import Keycloak, { KeycloakConfig } from 'keycloak-js';
import { toObservable } from '@angular/core/rxjs-interop';
import { EndPoints } from '@app/models/endpoints';
import { GlobalConstants } from '@app/global-constants';

export const initialState: EndPoints = {
  tenantEndPoint: '',
  hcclServicesEndPoint          : ''
};

@Injectable({
  providedIn: 'root',
})
export class AppConstants {
  endPoints = signal<EndPoints>(initialState);
  userDetails = signal<any>({});
  facility = signal({});
  isUserActive = signal<boolean>(false);
  serviceUrlPrefix = signal<string>('');
  checksprigAvailable = toObservable(signal<any>({}));
  endPointsLoaded = signal<boolean>(false);
  keycloakConfig = signal<KeycloakConfig>({
    url: '',
    realm: '',
    clientId: '',
  });

  private keycloak: Keycloak | null = null;
  http = inject(HttpClient);
  router = inject(Router);

  private isPublicPath(pathname: string): boolean {
    const cleanPath = (pathname || '').split('?')[0].split('#')[0];
    const segments = cleanPath.split('/').filter(Boolean);
    return segments.includes('public');
  }

  keycloakInitializer() {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        await this.__loadConfig();
        const isPublicRoute = this.isPublicPath(window.location.pathname);
        if (isPublicRoute) {
          resolve(true);
          return;
        }

        const keycloak: KeycloakConfig = this.keycloakConfig();
        keycloak.clientId = GlobalConstants.keycloak_clientId;
        this.keycloak = new Keycloak({
          url: keycloak.url,
          realm: keycloak.realm,
          clientId: keycloak.clientId,
        });

        const isAuthenticated = await this.keycloak.init({
          onLoad: 'login-required',
          checkLoginIframe: false,
        });

        if (isAuthenticated) {
          await this.loadUser();

          // Set up automatic token refresh - ADD THIS LINE
          this.setupTokenRefresh();
        }
        
        // Only redirect if not already on a valid route
        const currentUrl = this.router.url;
        if (currentUrl === '/' || currentUrl === '/login' || currentUrl.includes('state=') || currentUrl.includes('code=')) {
          //this.router.navigate(['/advocate-dashboard']);
        }
        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  }

  // Method to ensure token is valid (refreshes if needed)
async ensureTokenValid(): Promise<boolean> {
  if (!this.isLoggedIn()) {
    return true;
  }

  try {
    // updateToken(70) will refresh if token expires in less than 70 seconds
    const refreshed = await this.keycloak!.updateToken(70);
    if (refreshed) {
      this.setUserTokens();
      console.log('Token was refreshed');
    }
    return true;
  } catch (error) {
    console.error('Token refresh failed', error);
    this.logout();
    return false;
  }
}

// Method to manually refresh token
async refreshToken(): Promise<boolean> {
  if (!this.isLoggedIn()) {
    return false;
  }

  try {
    const refreshed = await this.keycloak!.updateToken(-1); // Force refresh
    if (refreshed) {
      this.setUserTokens();
      console.log('Token refreshed successfully');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to refresh token', error);
    this.logout();
    return false;
  }
}

// Add this to your keycloakInitializer method, after await this.loadUser();
private setupTokenRefresh(): void {
  // Automatically refresh token every 4 minutes
  setInterval(() => {
    if (this.isLoggedIn()) {
      this.keycloak?.updateToken(70).then((refreshed) => {
        if (refreshed) {
          this.setUserTokens();
          console.log('Token auto-refreshed');
        }
      }).catch((error) => {
        console.error('Auto token refresh failed', error);
        this.logout();
      });
    }
  }, 4 * 60 * 1000); // 4 minutes
}

  __loadConfig = async () => {
    try {
      if (this.endPointsLoaded()) return;

      const results = await Promise.all([
        fetch('assets/commonConfig/cluster_config.json'),
        fetch('assets/commonConfig/keycloak.json'),
      ]);
      const dataArr = await Promise.all(results.map((res) => res.json()));

      const hostname = document.location.hostname;
      const commonConfig = dataArr[0];

      let realmInfo = commonConfig.realms[hostname] || commonConfig.realms['default'];
      const [realmName, realmTenantId] = realmInfo;

      const keyCloakConfig = this.__templateReplace(dataArr[1], commonConfig.constants);
      keyCloakConfig.realm = realmName;
      keyCloakConfig.logoutUrl = GlobalConstants.keycloakLogoutUrl;

      const apiConfig = this.__templateReplace(GlobalConstants.apiServicesConstants, commonConfig.constants);
      apiConfig.tenantId = realmTenantId;

      if (commonConfig.debugEndpoints) {
        this.__resolveDebugEndpoints(apiConfig, commonConfig.debugEndpoints);
      }

      this.serviceUrlPrefix.set(commonConfig.constants.serviceUrlPrefix);
      this.endPoints.set(apiConfig.constants);
      this.keycloakConfig.set(keyCloakConfig);
      this.endPointsLoaded.set(true);

      return { keycloak: keyCloakConfig, apiconfig: apiConfig };
    } catch (err) {
      console.error(err);
      return;
    }
  };

  __templateReplace(obj: any, config: any) {
    let str = JSON.stringify(obj);
    for (const prop in config) {
      str = str.replace(new RegExp(`[$]{${prop}}`, 'g'), config[prop]);
    }
    return JSON.parse(str);
  }

  __resolveDebugEndpoints = async (apiConfig: any, debugConfig: any) => {
    try {
      const apiConstants = apiConfig.constants;
      for (const prop in debugConfig) {
        const val = debugConfig[prop];
        if (!val) continue;

        if (apiConstants[prop]) {
          const orig = apiConstants[prop];
          const path = orig.substring(orig.indexOf('/', orig.indexOf('//') + 2));
          apiConstants[prop] = val.endsWith('/') ? val : val + path;
        }
      }
    } catch (err) {
      console.error(err);
    }
    return debugConfig;
  };

  userTokens = signal<any>({});

  async loadUser() {
    if (!this.keycloak) return;
    const user = await this.keycloak.loadUserProfile();
    this.userDetails.set(user);
    this.setUserTokens();
    // await this.getProfileInfo();
  }

  setUserTokens() {
    if (!this.keycloak) return;
    const tokens = {
      token: this.keycloak.token,
      refreshToken: this.keycloak.refreshToken,
      idToken: this.keycloak.idToken,
    };
    this.userTokens.set(tokens);
    localStorage.setItem('userTokens', JSON.stringify(tokens));
  }

  getProfileInfo() {
    return new Promise((resolve, reject) => {
      const url = this.endPoints().tenantEndPoint + 'webcomponent/user-profile';
      this.http.get(url).subscribe({
        next: (res: any) => {
          this.isUserActive.set(res?.isActive);
          resolve(res);
        },
        error: (err) => reject(err),
      });
    });
  }

  isLoggedIn(): boolean {
    return !!this.keycloak?.token;
  }

  async updateToken(minValidity: number): Promise<void> {
    if (!this.keycloak) return;
    await this.keycloak.updateToken(minValidity);
  }

  getToken(): string | undefined {
    return this.keycloak?.token;
  }

  getUserRoles(): string[] {
    return this.keycloak?.realmAccess?.roles || [];
  }

  logout() {
    this.keycloak?.logout();
  }

  roles = signal<string[]>([]);

  async checkRoleExist(roleName: string) {
    if (this.isLoggedIn()) {
      const roles = this.getUserRoles();
      this.roles.set(roles);
      return roles.includes(roleName);
    }
    return false;
  }

  tenantId = signal<string>('');
  async getTenantId() {
    if (this.isLoggedIn()) {
      const token = this.getToken();

      if (token) {
        const payload = this.parseKeycloakToken(token);
        this.tenantId.set(payload.tenantId);
        return payload;
      }
    }
  }

  tenantUserId = signal<string>('');
  async getTenantUserId() {
    if (this.isLoggedIn()) {
      const token = this.getToken();
      if (token) {
        const payload = this.parseKeycloakToken(token);
        this.tenantUserId.set(payload.tenantUserId);
        return payload;
      }
    }
  }

  parseKeycloakToken(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  }
}


export function keycloakInitializer(appConstants: AppConstants): Promise<boolean> {
  return appConstants.keycloakInitializer();
}