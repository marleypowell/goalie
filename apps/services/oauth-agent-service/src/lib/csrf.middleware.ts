import { NextFunction, Request, Response } from 'express';
import { CookieEncryptionService } from './cookie-encryption.service';
import { generateRandomString } from './generate-random-string';

export interface NestCsrfOptions {
  cookieEncryptionService: CookieEncryptionService;
  cookieName?: string;
}

function setCookie(res: Response, cookie: string) {
  const prev = (res.getHeader('Set-Cookie') || res.getHeader('set-cookie') || []) as string | string[];
  const header = Array.isArray(prev) ? prev.concat(cookie) : [prev, cookie];
  res.setHeader('Set-Cookie', header);
}

export function nestCsrf(options?: NestCsrfOptions) {
  const config = {
    cookieName: 'csrf',
    ...options,
  };

  return (req: Request, res: Response, next: NextFunction): void => {
    // If the request has the CSRF cookie, then we assume that the CSRF token has already been set.
    let cookie = req.cookies ? req.cookies[config.cookieName] : null;
    if (cookie) {
      (req as any).csrfToken = (): string => config.cookieEncryptionService.decrypt(cookie);
      return next();
    }

    const csrfTokenValue = generateRandomString();
    cookie = config.cookieEncryptionService.createEncryptedCookie(config.cookieName, csrfTokenValue, {
      signed: false,
      path: '/',
      httpOnly: true,
      maxAge: 300,
    });
    setCookie(res, cookie);

    (req as any).csrfToken = (): string => csrfTokenValue;

    return next();
  };
}
