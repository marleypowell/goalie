import { HttpClient, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { mergeMap, Observable } from 'rxjs';

const HEADER_NAME = 'x-goalie-csrf';

export function xsrfInterceptorFn(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  if (req.method === 'GET' || req.method === 'HEAD') {
    return next(req);
  }

  const http = inject(HttpClient);

  return http
    .get('/oauth-agent/login/token', {
      withCredentials: true,
      responseType: 'text',
    })
    .pipe(
      mergeMap((token: string) => {
        if (token != null) {
          req = req.clone({ headers: req.headers.set(HEADER_NAME, token) });
        }

        return next(req);
      })
    );
}
