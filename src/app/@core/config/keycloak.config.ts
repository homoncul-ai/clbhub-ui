import { KeycloakConfig } from 'keycloak-js';

export const keycloakConfig: KeycloakConfig = {
  url: 'https://keycloak-gbs-dev.trutesta.io/auth', // e.g., 'http://localhost:8080/auth'
  realm: 'Intertek',
  clientId: 'trutesta'
}; 