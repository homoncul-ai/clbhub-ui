// ./common-service-request.model.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';

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

  // Special method for create operations that return status 201 and the id in the response body
  requestCreate<T>(req: CommonServiceRequest): Observable<T> {
    const url = `${this.baseUrl}${req.url}`;
    const options = {
      headers: new HttpHeaders(req.headers || {}),
      params: new HttpParams({ fromObject: req.params || {} }),
      observe: 'response' as const // Get the full response including headers
    };

    let httpRequest: Observable<any>;

    switch (req.method) {
      case 'POST':
        httpRequest = this.http.post(url, req.body, options);
        break;
      default:
        throw new Error(`Unsupported method: ${req.method}`);
    }

    return httpRequest.pipe(
      retry(2), // Optionally retry failed requests up to 2 times
      catchError(this.handleError),
      // Map the response to extract the ID from headers or body
      map((response: any) => {
        // Check if we got a 201 status (Created)
        if (response.status === 201) {
          // Try to extract ID from Location header first
          const locationHeader = response.headers.get('Location');
          if (locationHeader) {
            const locationParts = locationHeader.split('/');
            const id = locationParts[locationParts.length - 1];
            return { id: id, status: 201 };
          }
          
          // If no Location header, check if ID is in response body
          if (response.body && response.body.id) {
            return { id: response.body.id, status: 201 };
          }
          
          // If response body is just the ID as a string
          if (response.body && typeof response.body === 'string') {
            return { id: response.body, status: 201 };
          }
          
          // If response body is a number (ID)
          if (response.body && typeof response.body === 'number') {
            return { id: response.body.toString(), status: 201 };
          }
        }
        
        // Return the original response if we can't extract ID
        return response.body || response;
      })
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
  