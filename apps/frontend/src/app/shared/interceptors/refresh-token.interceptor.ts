import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, mergeMap, Observable, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';

/**
 * Interceptor that refreshes the token if the request fails with a 401.
 * @param req the request
 * @param next the next handler
 * @returns the response
 */
export function refreshTokenInterceptorFn(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && (error.status === HttpStatusCode.Unauthorized || error.status === 0)) {
        return authService.refreshToken().pipe(mergeMap(() => next(req)));
      }

      return throwError(() => error);
    })
  );
}
