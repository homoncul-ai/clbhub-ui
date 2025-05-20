import { Injectable } from '@angular/core';
import { KeycloakService as KeycloakAngularService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { keycloakConfig } from '../config/keycloak.config';

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {
  constructor(private keycloak: KeycloakAngularService) {}

  async init(): Promise<void> {
    try {
      await this.keycloak.init({
        config: keycloakConfig,
        initOptions: {
          onLoad: 'login-required',
          silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
          pkceMethod: 'S256'
        }
      });
    } catch (error) {
      console.error('Keycloak init failed', error);
    }
  }

  async login(): Promise<void> {
    await this.keycloak.login();
  }

  async logout(): Promise<void> {
    await this.keycloak.logout();
  }

  async getToken(): Promise<string> {
    try {
      await this.keycloak.updateToken(30);
      return this.keycloak.getToken();
    } catch (error) {
      console.error('Failed to refresh token', error);
      return '';
    }
  }

  async getUserProfile(): Promise<KeycloakProfile | null> {
    try {
      return await this.keycloak.loadUserProfile();
    } catch (error) {
      console.error('Failed to load user profile', error);
      return null;
    }
  }

  isLoggedIn(): boolean {
    return this.keycloak.isLoggedIn();
  }

  getRoles(): string[] {
    return this.keycloak.getUserRoles();
  }
} 