import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { CommonRequestServiceCaller } from './common-request-service.model';
import { GlobalConstants } from '@app/global-constants';
import { AppConstants } from '@app/shell/services/config.service';

export class RequestServiceCaller extends CommonRequestServiceCaller {
  constructor(http: HttpClient, endpointCode: string) {
    super(http);
    const baseUrl = this.getEndPoint(endpointCode);
    console.log(`Setting baseUrl for endpoint '${endpointCode}' to ${baseUrl}`);
    this.setBaseUrl(baseUrl);
  }

  public getEndPoint(endpointCode: string): string {
    if (endpointCode === 'dlp') {
      return this.getDlpRootEndPoint();
    }
    if (endpointCode === 'hccl') {
      // Prefer cluster_config-resolved endpoint (templates like ${serviceUrlPrefix} already substituted).
      const appConstants = inject(AppConstants);
      const configured = appConstants.endPoints()?.hcclServicesEndPoint?.trim();
      if (configured && !configured.includes('${')) {
        return configured;
      }
      const prefix = appConstants.serviceUrlPrefix()?.trim();
      if (prefix) {
        return `${prefix}/trutesta-hccl-services`;
      }
      return GlobalConstants.apiServicesConstants.constants.hcclServicesEndPoint;
    }
    return '';
  }

  public getDlpRootEndPoint(): string {
    return 'http://localhost:8099/trutesta-dlp-services';
  }
}
