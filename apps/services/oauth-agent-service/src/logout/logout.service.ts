import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CookieService } from '../lib/cookie.service';
import { CurityService } from '../lib/curity.service';
import { LogoutResponse } from './models/logout-response.model';

@Injectable()
export class LogoutService {
  public constructor(private readonly curityService: CurityService, private readonly cookieService: CookieService) {}

  public getLogoutResponse(cookies: Record<string, string>): LogoutResponse & { cookiesToSet: string[] } {
    const accessToken = this.cookieService.getAccessTokenCookie(cookies);

    if (!accessToken) {
      throw new UnauthorizedException('Not logged in');
    }

    return {
      url: this.curityService.createLogoutRequestUrl(),
      cookiesToSet: this.cookieService.getLogoutCookies(),
    };
  }
}