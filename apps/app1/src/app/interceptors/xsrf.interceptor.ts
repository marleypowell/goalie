import { HttpClient, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { mergeMap, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const HEADER_NAME = 'x-goalie-csrf';

export function xsrfInterceptorFn(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const lcUrl = req.url.toLowerCase();

  if (
    req.method === 'GET' ||
    req.method === 'HEAD' ||
    lcUrl.startsWith('http://') ||
    lcUrl.startsWith('https://') ||
    (environment.basePath && !lcUrl.startsWith(environment.basePath))
  ) {
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
