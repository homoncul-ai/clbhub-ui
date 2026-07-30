import { HttpClient } from '@angular/common/http';
import { CommonRequestServiceCaller } from './common-request-service.model';
import { GlobalConstants } from '@app/global-constants';

export class RequestServiceCaller extends CommonRequestServiceCaller {
  constructor(http: HttpClient, endpointCode: string) {
    super(http);
    const baseUrl = this.getEndPoint(endpointCode);
    console.log(`Setting baseUrl for endpoint '${endpointCode}' to ${baseUrl}`);
    this.setBaseUrl(baseUrl);
  }

  public  getEndPoint(endpointCode : string) : string {
    if (endpointCode === "dlp") {
      return   this.getDlpRootEndPoint() ;
    }
    if (endpointCode === "hccl") {
      return   GlobalConstants.apiServicesConstants.constants.hcclServicesEndPoint;
    }
    return "";
  }

  
  public  getDlpRootEndPoint() : string {
    return "http://localhost:8099/trutesta-dlp-services";
  }
  
}
