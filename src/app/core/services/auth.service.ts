// src/app/core/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { LoginResponse, UserData } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiBase = '/api/app/apipayroll/';

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

          // Store full user object — components read from this
          localStorage.setItem('user', JSON.stringify(userData));

          // Tokens
          localStorage.setItem('accessToken',  response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);

          // Shortcut keys used across the app
          localStorage.setItem('org',        String(userData.org));
          localStorage.setItem('employeeId', userData.Sf_code);  // "EMP26063" — use this everywhere
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

  // Returns "EMP26063" — the real employee code used in API calls
  getEmployeeId(): string {
    return localStorage.getItem('employeeId') || '';
  }
}