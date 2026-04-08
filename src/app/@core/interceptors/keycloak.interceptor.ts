import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AppConstants } from '@app/shell/services/config.service';

@Injectable()
export class KeycloakInterceptor implements HttpInterceptor {
  constructor(private appConstants: AppConstants) {}

  private isPublicApiRequest(url: string): boolean {
    return /\/hccl\/public(\/|$)/.test(url || '');
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.isPublicApiRequest(request.url)) {
      return next.handle(request);
    }

    if (!this.appConstants.isLoggedIn()) {
  //    alert('not logged in');
      return next.handle(request);
    }

    // Ensure token is valid before making the request
    return from(this.appConstants.ensureTokenValid()).pipe(
      switchMap(() => {
        // Clone request and add the current token
        const token = this.appConstants.getToken();
        if (token) {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });
        }
        
        return next.handle(request).pipe(
          catchError((error: HttpErrorResponse) => {
 //           alert('error: ' + JSON.stringify(error) + ' isLoggedIn: ' + this.appConstants.isLoggedIn());
            if (error.status === 401 && this.appConstants.isLoggedIn()) {
              // Token expired, try to refresh
              return from(this.appConstants.refreshToken()).pipe(
                switchMap((refreshed) => {
                  if (refreshed) {
                    // Retry the request with new token
                    const newToken = this.appConstants.getToken();
                    const clonedRequest = request.clone({
                      setHeaders: {
                        Authorization: `Bearer ${newToken}`
                      }
                    });
                    return next.handle(clonedRequest);
                  } else {
                    // Refresh failed, logout
                    this.appConstants.logout();
                    return throwError(() => error);
                  }
                }),
                catchError((refreshError) => {
                  this.appConstants.logout();
                  return throwError(() => error);
                })
              );
            }
            return throwError(() => error);
          })
        );
      })
    );
  }
}