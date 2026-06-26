// ============================================================
// FILE: src/app/core/interceptors/auth.interceptor.ts
// ============================================================

import {
  HttpInterceptorFn, 
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {

  const router = inject(Router);
  const token  = localStorage.getItem('accessToken');

  // ── Attach JWT Bearer token to every outgoing request
  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
    : req;

  return next(authReq).pipe(

    catchError((error: HttpErrorResponse) => {

      // ── 401 Unauthorized → clear storage and redirect to login
      if (error.status === 401) {
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('org');
        router.navigate(['']);
      }

      return throwError(() => error);
    })

  );

};