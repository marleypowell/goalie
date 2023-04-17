import { Injectable, UnauthorizedException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { CookieService } from '../lib/cookie.service';
import { CurityService } from '../lib/curity.service';
import { UserInfo } from '../lib/user-info';

/**
 * The user info service. It is used to get user info from the access token.
 */
@Injectable()
export class UserInfoService {
  public constructor(private readonly curityService: CurityService, private readonly cookieService: CookieService) {}

  public async getUserInfo(cookies: Record<string, string>): Promise<UserInfo> {
    const accessToken = this.cookieService.getAccessTokenCookie(cookies);

    if (!accessToken) {
      throw new UnauthorizedException('No access token cookie was supplied in a call to get user info');
    }

    return firstValueFrom(this.curityService.getUserInfo(accessToken));
  }
}
