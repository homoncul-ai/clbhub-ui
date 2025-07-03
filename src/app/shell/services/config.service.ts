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

  private keycloak!: Keycloak;
  http = inject(HttpClient);
  router = inject(Router);

    keycloakInitializer() {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        await this.__loadConfig();
        const keycloak: KeycloakConfig = this.keycloakConfig();
        keycloak.clientId = GlobalConstants.keycloak_clientId;
        this.keycloak = new Keycloak({
          url: keycloak.url,
          realm: keycloak.realm,
          clientId: keycloak.clientId,
        });

        await this.keycloak.init({
          onLoad: 'login-required',
          checkLoginIframe: false,
        });

        await this.loadUser();
        this.router.navigate(['/advocate-dashboard']);
        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
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
    const user = await this.keycloak.loadUserProfile();
    this.userDetails.set(user);
    this.setUserTokens();
    // await this.getProfileInfo();
  }

  setUserTokens() {
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
    return !!this.keycloak.token;
  }

  async updateToken(minValidity: number): Promise<void> {
    await this.keycloak.updateToken(minValidity);
  }

  getToken(): string | undefined {
    return this.keycloak.token;
  }

  getUserRoles(): string[] {
    return this.keycloak.realmAccess?.roles || [];
  }

  logout() {
    this.keycloak.logout();
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