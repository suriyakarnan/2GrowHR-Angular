// ============================================================
// FILE: src/app/core/services/auth.service.ts
// ============================================================

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

  // ──────────────────────────────────────────────────────────
  // LOGIN
  // POST /apipayroll/?axn=Login&username=xx&password=xx
  // ──────────────────────────────────────────────────────────
  login(username: string, password: string): Observable<LoginResponse> {

    const params = new HttpParams()
      .set('axn', 'Login')
      .set('username', username)
      .set('password', password);

    return this.http.post<LoginResponse>(
      this.apiBase,
      null,       // no body — params are in the URL
      { params }
    ).pipe(

      tap((response: LoginResponse) => {

        if (response.success && response.Data?.length > 0) {

          const userData: UserData = response.Data[0];

          // Store user object
          localStorage.setItem('user', JSON.stringify(userData));

          // Store JWT access token  ← used by interceptor
          localStorage.setItem('accessToken', response.accessToken);

          // Store refresh token
          localStorage.setItem('refreshToken', response.refreshToken);

          // Store org id for future API calls
          localStorage.setItem('org', String(userData.org));

        }

      }),

      catchError((error) => {
        console.error('Login API Error:', error);
        return throwError(() => new Error('Login failed. Please try again.'));
      })

    );

  }

  // ──────────────────────────────────────────────────────────
  // LOGOUT — clears everything and redirects to login
  // ──────────────────────────────────────────────────────────
  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('org');
    this.router.navigate(['']);
  }

  // ──────────────────────────────────────────────────────────
  // IS LOGGED IN — checks accessToken in localStorage
  // ──────────────────────────────────────────────────────────
  isLoggedIn(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  // ──────────────────────────────────────────────────────────
  // GET ACCESS TOKEN — used by interceptor
  // ──────────────────────────────────────────────────────────
  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  // ──────────────────────────────────────────────────────────
  // GET REFRESH TOKEN
  // ──────────────────────────────────────────────────────────
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  // ──────────────────────────────────────────────────────────
  // GET USER DATA
  // ──────────────────────────────────────────────────────────
  getUser(): UserData {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  // ──────────────────────────────────────────────────────────
  // GET ORG ID — use this in API calls that need org
  // ──────────────────────────────────────────────────────────
  getOrg(): string {
    return localStorage.getItem('org') || '';
  }

}