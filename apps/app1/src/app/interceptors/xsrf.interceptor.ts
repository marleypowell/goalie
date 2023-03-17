import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoginService } from '@goalie/shared/api-client-oauth-agent';
import { mergeMap, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const HEADER_NAME = 'x-goalie-csrf';

export function xsrfInterceptorFn(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const lcUrl = req.url.toLowerCase();

  if (
    req.method === 'GET' || req.method === 'HEAD' || environment.basePath
      ? !lcUrl.startsWith(environment.basePath)
      : lcUrl.startsWith('http://') || lcUrl.startsWith('https://')
  ) {
    return next(req);
  }

  const loginService = inject(LoginService);

  return loginService.getCsrfToken().pipe(
    mergeMap((token: string) => {
      if (token != null) {
        req = req.clone({ headers: req.headers.set(HEADER_NAME, token) });
      }

      return next(req);
    })
  );
}
