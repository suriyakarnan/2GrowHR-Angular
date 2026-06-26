// ============================================================
// FILE: src/app/core/services/api.service.ts
// ============================================================

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiBase = '/api/app/apipayroll/';

  constructor(private http: HttpClient) {}

  // ──────────────────────────────────────────────────────────
  // GET REQUEST
  // Usage: this.apiService.get<MyType>('GetEmployeeList', { org: '36' })
  // ──────────────────────────────────────────────────────────
  get<T>(axn: string, extraParams?: Record<string, string>): Observable<T> {

    let params = new HttpParams().set('axn', axn);

    if (extraParams) {
      Object.entries(extraParams).forEach(([key, value]) => {
        params = params.set(key, value);
      });
    }

    return this.http.get<T>(this.apiBase, { params }).pipe(
      catchError(this.handleError)
    );

  }

  // ──────────────────────────────────────────────────────────
  // POST REQUEST — params in URL, optional JSON body
  // Usage: this.apiService.post<MyType>('SaveLeave', { emp_id: '1' }, bodyObj)
  // ──────────────────────────────────────────────────────────
  post<T>(axn: string, extraParams?: Record<string, string>, body: any = null): Observable<T> {

    let params = new HttpParams().set('axn', axn);

    if (extraParams) {
      Object.entries(extraParams).forEach(([key, value]) => {
        params = params.set(key, value);
      });
    }

    return this.http.post<T>(this.apiBase, body, { params }).pipe(
      catchError(this.handleError)
    );

  }

  // ──────────────────────────────────────────────────────────
  // POST FORM DATA — for file uploads
  // Usage: this.apiService.postForm<MyType>('UploadProfile', formData, { emp_id: '1' })
  // ──────────────────────────────────────────────────────────
  postForm<T>(axn: string, formData: FormData, extraParams?: Record<string, string>): Observable<T> {

    let params = new HttpParams().set('axn', axn);

    if (extraParams) {
      Object.entries(extraParams).forEach(([key, value]) => {
        params = params.set(key, value);
      });
    }

    return this.http.post<T>(this.apiBase, formData, { params }).pipe(
      catchError(this.handleError)
    );

  }

  // ──────────────────────────────────────────────────────────
  // CENTRAL ERROR HANDLER
  // ──────────────────────────────────────────────────────────
  private handleError(error: any): Observable<never> {
    let errorMessage = 'Something went wrong. Please try again.';

    if (error.status === 400) errorMessage = 'Bad request.';
    if (error.status === 401) errorMessage = 'Unauthorized. Please login again.';
    if (error.status === 403) errorMessage = 'Access denied.';
    if (error.status === 404) errorMessage = 'Resource not found.';
    if (error.status === 500) errorMessage = 'Server error. Please try again later.';

    console.error('API Error:', error);
    return throwError(() => new Error(errorMessage));
  }

}