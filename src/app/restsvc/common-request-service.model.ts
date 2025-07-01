// ./common-service-request.model.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommonRequestServiceCaller {
  private baseUrl: string = "";
  
  constructor(private http: HttpClient) {
  }
  
  getBaseUrl() {
    return this.baseUrl;
  }
  
  setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  convertToString(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }
    return String(value);
  }

  request<T>(req: CommonServiceRequest): Observable<T> {
    const url = `${this.baseUrl}${req.url}`;
    const options = {
      headers: new HttpHeaders(req.headers || {}),
      params: new HttpParams({ fromObject: req.params || {} })
    };

    let httpRequest: Observable<T>;

    switch (req.method) {
      case 'GET':
        httpRequest = this.http.get<T>(url, options);
        break;
      case 'POST':
        httpRequest = this.http.post<T>(url, req.body, options);
        break;
      case 'PUT':
        httpRequest = this.http.put<T>(url, req.body, options);
        break;
      case 'DELETE':
        httpRequest = this.http.delete<T>(url, options);
        break;
      case 'PATCH':
        httpRequest = this.http.patch<T>(url, req.body, options);
        break;
      default:
        throw new Error(`Unsupported method: ${req.method}`);
    }

    return httpRequest.pipe(
      retry(2), // Optionally retry failed requests up to 2 times
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      console.error('A client-side or network error occurred:', error.error.message);
    } else {
      // Backend returned an unsuccessful response code
      console.error(
        `Backend returned code ${error.status}, body was: ${JSON.stringify(error.error)}`
      );
    }
    // Return an observable with a user-facing error message
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}

export interface CommonServiceRequest<BodyType = any> {
  baseUrl?: string;
  url: string;                              // URL suffix, e.g. "/admin/students/query"
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';  // HTTP method
  body?: BodyType;                         // Optional request payload, typed generically
  params?: { [param: string]: string | string[] }; // Optional query params
  headers?: { [header: string]: any | any[] }; // Optional HTTP headers
}
  