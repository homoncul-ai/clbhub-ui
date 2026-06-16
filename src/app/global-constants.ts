export class GlobalConstants {
  public static keycloak_clientId = 'trutesta';
  public static keycloakLogoutUrl = '/';

  public static apiServicesConstants = {
    constants: {
      tenantEndPoint: '${serviceUrlPrefix}/dc-tenant-service/tenants/',
      hcclServicesEndPoint: '${serviceUrlPrefix}/trutesta-hccl-services',
    },
  };

}
