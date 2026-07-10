// src/app/core/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { LoginResponse, UserData } from '../models/user.model';
import { environment } from '../../../environments/environment';

export type UserRole = 'admin' | 'employee';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiBase = `${environment.apiBaseUrl}api/app/apipayroll/`;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  // ── LOGIN ─────────────────────────────────────────────────
  login(username: string, password: string): Observable<LoginResponse> {

    const params = new HttpParams()
      .set('axn', 'Login')
      .set('username', username)
      .set('password', password);

    return this.http.post<LoginResponse>(
      this.apiBase,
      null,
      { params }
    ).pipe(

      tap((response: LoginResponse) => {
        if (response.success && response.Data?.length > 0) {

          const userData: UserData = response.Data[0];

          // Today: API has no role field → defaults to 'employee'.
          // Tomorrow: Admin API adds `userData.role` → this line needs zero changes.
          const role: UserRole = (userData as any).role === 'admin' ? 'admin' : 'employee';

          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('accessToken',  response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
          localStorage.setItem('org',        String(userData.org));
          localStorage.setItem('employeeId', userData.Sf_code);
          localStorage.setItem('role', role);
        }
      }),

      catchError((error) => {
        console.error('Login API Error:', error);
        return throwError(() => new Error('Login failed. Please try again.'));
      })

    );
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

  // 🚧 TEMPORARY — remove once real Admin login API exists
  setRoleManually(role: UserRole): void {
    localStorage.setItem('role', role);
    if (!this.isLoggedIn()) {
      localStorage.setItem('accessToken', 'dev-fake-token');
    }
  }

}