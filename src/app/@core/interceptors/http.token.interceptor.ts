import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { AppConstants } from '@app/shell/services/config.service';

@Injectable({ providedIn: 'root' })
export class HttpTokenInterceptor implements HttpInterceptor {
  constructor(private appConstants: AppConstants) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return from(this.appConstants.getTenantId()).pipe(
      mergeMap((tenant: any) => {
        if (tenant && tenant.tenantId ) {
          const headersConfig = {
            'X-TenantId': tenant.tenantId,
          };
          const request = req.clone({ setHeaders: headersConfig });
          return next.handle(request);
        } else {
          return next.handle(req);
        }
      })
    );
  }
}
