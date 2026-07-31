
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError, switchMap, of } from 'rxjs';
import { LoginResponse, UserData } from '../models/user.model';
import { environment } from '../../../environments/environment';

export type UserRole = 'admin' | 'employee';

interface AdminLoginApiResponse {
  success: boolean;
  message: string;
  accessToken: string;
  data: {
    organizationId: number;
    organizationName: string;
    mailId: string;
    username: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiBase = `${environment.apiBaseUrl}api/app/apipayroll/`;

  private adminApiBase = `${environment.apiBaseUrl}api/admin/`;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  
  login(username: string, password: string): Observable<any> {

    return this.employeeLogin(username, password).pipe(

      switchMap((res: LoginResponse) => {
        if (res.success && res.Data?.length > 0) {
          this.storeEmployeeSession(res);
          return of(res);
        }
        // Employee login didn't match → try Admin
        return this.adminLogin(username, password);
      }),

      catchError(() => {
        // Employee API itself errored (network/4xx/5xx) → try Admin
        return this.adminLogin(username, password);
      })

    );
  }

  // ── EMPLOYEE LOGIN (existing logic, unchanged) ──────────────
  private employeeLogin(username: string, password: string): Observable<LoginResponse> {

    const params = new HttpParams()
      .set('axn', 'Login')
      .set('username', username)
      .set('password', password);

    return this.http.post<LoginResponse>(
      this.apiBase,
      null,
      { params }
    );
  }

  // ── ADMIN LOGIN (new) ────────────────────────────────────────
  private adminLogin(username: string, password: string): Observable<AdminLoginApiResponse> {

    return this.http.post<AdminLoginApiResponse>(
      `${this.adminApiBase}login`,
      { Username: username, Password: password }
    ).pipe(

      tap((response: AdminLoginApiResponse) => {
        if (response.success) {
          this.storeAdminSession(response);
        }
      }),

      catchError((error) => {
        console.error('Admin Login API Error:', error);
        return throwError(() => new Error('Invalid username or password.'));
      })

    );
  }

  // ── SESSION STORAGE — Employee ──────────────────────────────
  private storeEmployeeSession(response: LoginResponse): void {
    const userData: UserData = response.Data[0];

    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('accessToken',  response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('org',        String(userData.org));
    localStorage.setItem('employeeId', userData.Sf_code);
    localStorage.setItem('role', 'employee');
  }

  // ── SESSION STORAGE — Admin ──────────────────────────────────
  private storeAdminSession(response: AdminLoginApiResponse): void {
    const adminData = response.data;

    localStorage.setItem('user', JSON.stringify(adminData));
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('org', String(adminData.organizationId));
    localStorage.setItem('role', 'admin');
  }

  // ── LOGOUT ────────────────────────────────────────────────
  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('org');
    localStorage.removeItem('employeeId');
    localStorage.removeItem('role');
    this.router.navigate(['']);
  }

  // ── HELPERS ───────────────────────────────────────────────
  isLoggedIn(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  getUser(): UserData {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  getOrg(): string {
    return localStorage.getItem('org') || '';
  }

  getEmployeeId(): string {
    return localStorage.getItem('employeeId') || '';
  }

  getRole(): UserRole {
    return (localStorage.getItem('role') as UserRole) || 'employee';
  }

}