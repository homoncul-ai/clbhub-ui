import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { HcclContextService } from '@app/shell/services/hccl-context.service';

@Injectable({ providedIn: 'root' })
export class HttpUserProfileIdInterceptor implements HttpInterceptor { 
  constructor(private hcclContextService: HcclContextService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const userProfileId = this.hcclContextService.getCurrentUserProfileId();
    
    if (userProfileId && userProfileId.trim() !== '') {
      const headersConfig = {
        'X-UserProfileId': userProfileId,
      };
      const request = req.clone({ setHeaders: headersConfig });
      return next.handle(request);
    } else {
      return next.handle(req);
    }
  }
}
