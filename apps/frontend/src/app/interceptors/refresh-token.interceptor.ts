import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, mergeMap, Observable, throwError } from 'rxjs';
import { AuthService } from '../auth.service';

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
