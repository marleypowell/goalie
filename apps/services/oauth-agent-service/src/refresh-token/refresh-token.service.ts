import { BadRequestException, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { CookieService } from '../lib/cookie.service';
import { CurityService } from '../lib/curity.service';

/**
 * The refresh token service. It is used to refresh the access token.
 */
@Injectable()
export class RefreshTokenService {
  public constructor(private readonly curityService: CurityService, private readonly cookieService: CookieService) {}

  /**
   * Refresh the access token. The refresh token is stored in a cookie.
   * @param cookies the cookies
   * @returns the cookies to set
   */
  public async refreshToken(cookies: Record<string, string>): Promise<{ cookiesToSet: string[] }> {
    const refreshToken = this.cookieService.getRefreshTokenCookie(cookies);

    if (!refreshToken) {
      throw new BadRequestException('No refresh token cookie was supplied in a call to refresh token');
    }

    const tokenResponse = await firstValueFrom(this.curityService.getRefreshToken(refreshToken));

    const cookiesToSet = this.cookieService.getTokenResponseCookies(tokenResponse, false);

    return {
      cookiesToSet,
    };
  }
}
