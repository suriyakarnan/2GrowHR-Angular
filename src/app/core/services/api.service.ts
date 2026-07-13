

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

type HttpParamsRecord = Record<string, string | number | boolean>;

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly baseUrl: string = environment.apiBaseUrl;

  private getPrivateHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    });
  }

  public get<T>(url: string, params?: HttpParamsRecord): Observable<T> {
    return this.http
      .get<T>(`${this.baseUrl}${url}`, {
        headers: this.getPrivateHeaders(),
        params: new HttpParams({ fromObject: params ?? {} }),
      })
      .pipe(catchError(this.handleError));
  }

  public post<T>(
    url: string,
    body: any = null,
    params?: HttpParamsRecord,
  ): Observable<T> {
    return this.http
      .post<T>(`${this.baseUrl}${url}`, body, {
        headers: this.getPrivateHeaders(),
        params: new HttpParams({ fromObject: params ?? {} }),
      })
      .pipe(catchError(this.handleError));
  }


  public postForm<T>(
    url: string,
    formData: FormData,
    params?: HttpParamsRecord,
  ): Observable<T> {
    return this.http
      .post<T>(`${this.baseUrl}${url}`, formData, {
        headers: this.getPrivateHeaders(), 
        params: new HttpParams({ fromObject: params ?? {} }),
      })
      .pipe(catchError(this.handleError));
  }

  public getFile(url: string, params?: HttpParamsRecord): Observable<Blob> {
    return this.http
      .get(`${this.baseUrl}${url}`, {
        headers: this.getPrivateHeaders(),
        params: new HttpParams({ fromObject: params ?? {} }),
        responseType: 'blob',
      })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'Something went wrong. Please try again.';
    if (error.status === 400) errorMessage = 'Bad request.';
    if (error.status === 401)
      errorMessage = 'Unauthorized. Please login again.';
    if (error.status === 403) errorMessage = 'Access denied.';
    if (error.status === 404) errorMessage = 'Resource not found.';
    if (error.status === 405) errorMessage = 'Method not allowed.';
    if (error.status === 500)
      errorMessage = 'Server error. Please try again later.';
    console.error('API Error:', error);
    return throwError(() => new Error(errorMessage));
  }

  getBlob(url: string): Observable<Blob> {
    return this.http.get(url, {
      headers: this.getPrivateHeaders(),
      responseType: 'blob'
   
    }).pipe(catchError(this.handleError));
  }

  public postFile(url: string, body: any, params?: HttpParamsRecord): Observable<Blob> {
  return this.http
    .post(`${this.baseUrl}${url}`, body, {
      headers: this.getPrivateHeaders(),
      params: new HttpParams({ fromObject: params ?? {} }),
      responseType: 'blob',
    })
    .pipe(catchError(this.handleError));
}
}
