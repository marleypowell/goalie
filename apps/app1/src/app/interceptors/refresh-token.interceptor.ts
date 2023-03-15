import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { RefreshTokenService } from '@goalie/shared/api-client-oauth-agent';
import { catchError, mergeMap, Observable, throwError } from 'rxjs';

export function refreshTokenInterceptorFn(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const refreshTokenService = inject(RefreshTokenService);

  return next(req).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === HttpStatusCode.Unauthorized) {
        return refreshTokenService.refreshToken().pipe(mergeMap(() => next(req)));
      }

      return throwError(() => error);
    })
  );
}
