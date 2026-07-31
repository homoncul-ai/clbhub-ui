export class GlobalConstants {
  public static keycloak_clientId = 'trutesta';
  public static keycloakLogoutUrl = '/';
  /** Google reCAPTCHA v3 site key fallback when cluster_config has no clbhub.captchaSiteKey. */
  public static defaultCaptchaSiteKey = '6LeNSiQtAAAAAHQjexlK52yRi8F4lwgPnyaZltpK';
  // Under trutesta 

  public static apiServicesConstants = {
    constants: {
      tenantEndPoint: '${serviceUrlPrefix}/dc-tenant-service/tenants/',
      hcclServicesEndPointInternal: 'http://localhost:8099/trutesta-hccl-services',
      hcclServicesEndPoint: 'https://gbs-qa.trutesta.io/trutesta-hccl-services',
    },
  };

}
