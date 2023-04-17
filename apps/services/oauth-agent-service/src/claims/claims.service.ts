import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CookieService } from '../lib/cookie.service';

/**
 * The claims service. It is used to get claims from the access token.
 */
@Injectable()
export class ClaimsService {
  public constructor(private readonly cookieService: CookieService) {}

  /**
   * Get claims from the access token. The access token is stored in a cookie.
   * @param cookies the cookies
   * @returns the claims
   */
  public getClaims(cookies: Record<string, string>): Record<string, any> {
    const idToken = this.cookieService.getIdTokenCookie(cookies);

    if (!idToken) {
      throw new UnauthorizedException('No ID token cookie was supplied in a call to get claims');
    }

    const tokenParts = idToken.split('.');
    if (tokenParts.length !== 3) {
      throw new UnauthorizedException('ID token is not a valid JWT');
    }

    const [_header, payload, _signature] = tokenParts;

    try {
      const claims = JSON.parse(String(Buffer.from(payload, 'base64').toString('binary')));
      return claims;
    } catch (error) {
      throw new UnauthorizedException('ID token is not a valid JWT');
    }
  }
}
