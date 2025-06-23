import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { CommonRequestServiceCaller, CommonServiceRequest } from './common-request-service.model';


// ============================================================================
// SERVICE CLASS
// ============================================================================

@Injectable({
  providedIn: 'root'
})
export class TenantService extends CommonRequestServiceCaller {
 

  constructor(http: HttpClient) {
    super(http);
    const baseUrl = 'https://devops2.intigna.io/trutesta-hccl-services';
    //  private readonly baseUrl = 'http://localhost:8099/trutesta-hccl-services';
    this.setBaseUrl(baseUrl);
  }
  /*
  Create TypeScript interfaces and service methods for the All endpoints 
using the "CommonServiceRequest" object and calling using 
CommonRequestServiceCaller request method.

Generate the service calls for ALL the endpoints in the swagger json 
This prompt captures:
What: TypeScript interfaces and service methods
For: all  endpoints except the following paths : healthchecks

From: Swagger documentation [swagger-file]
In: [service-ts-file]
Using: CommonRequestServiceCaller.request  (instead of custom HTTP handling)
Key Requirement: Leverage existing shared HTTP service infrastructure

The prompt emphasizes the architectural decision to use the super 
CommonRequestServiceCaller request methods
 rather than implementing custom HTTP handling logic.

  */ 

  
}
