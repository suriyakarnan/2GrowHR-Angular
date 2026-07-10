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

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(

    catchError((error: HttpErrorResponse) => {

      if (error.status === 401) {

        // 🚧 TEMPORARY — don't auto-logout when using the fake dev-admin token
        const isDevFakeToken = localStorage.getItem('accessToken') === 'dev-fake-token';
        if (isDevFakeToken) {
          console.warn('Dev fake-admin token got 401 — real API rejected it. Ignoring logout for dev testing.');
          return throwError(() => error);
        }

        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('org');
        localStorage.removeItem('role');
        router.navigate(['']);
      }

      return throwError(() => error);
    })

  );

};