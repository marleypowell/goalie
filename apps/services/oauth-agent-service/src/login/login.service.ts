import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { CookieService } from '../lib/cookie.service';
import { CurityService } from '../lib/curity.service';
import AuthorizationResponseException from '../lib/exceptions/AuthorizationResponseException';
import InvalidStateException from '../lib/exceptions/InvalidStateException';
import MissingTempLoginDataException from '../lib/exceptions/MissingTempLoginDataException';
import { generateRandomString } from '../lib/generate-random-string';
import { LoginEndResponse, LoginStartResponse } from './login.controller';

@Injectable()
export class LoginService {
  public constructor(private readonly curityService: CurityService, private readonly cookieService: CookieService) {}

  public loginStart(): LoginStartResponse & { tempLoginDataCookie: string } {
    const state = generateRandomString();
    const codeVerifier = generateRandomString();
    return {
      authorizationRequestUrl: this.curityService.createAuthorizationRequestUrl(state, codeVerifier),
      tempLoginDataCookie: this.cookieService.createTempLoginDataCookie(codeVerifier, state),
    };
  }

  public async loginEnd(
    pageUrl: string,
    cookies: Record<string, string>
  ): Promise<LoginEndResponse & { cookiesToSet?: string[] }> {
    const data = this.decodePageUrl(pageUrl);

    if (!(data.code && data.state)) {
      return {
        isLoggedIn: !!this.cookieService.getAccessTokenCookie(cookies),
        handled: false,
      };
    }

    const tempLoginData = this.cookieService.getTempLoginData(cookies);

    if (!tempLoginData) {
      return Promise.reject(new MissingTempLoginDataException());
    }

    if (tempLoginData.state !== data.state) {
      return Promise.reject(new InvalidStateException());
    }

    const tokenResponse = await firstValueFrom(this.curityService.getToken(data.code, tempLoginData.codeVerifier));

    // TODO: Implement ID token validation
    // if (tokenResponse.id_token) {
    // validateIDtoken(config, tokenResponse.id_token);
    // }

    const cookiesToSet = this.cookieService.getTokenResponseCookies(tokenResponse, true);

    return {
      isLoggedIn: true,
      handled: true,
      cookiesToSet,
    };
  }

  private decodePageUrl(pageUrl: string | undefined): {
    code: string | null;
    state: string | null;
  } {
    function getUrlParts(url?: string): URLSearchParams | null {
      if (url) {
        const urlData = new URL(url);
        if (urlData.searchParams) {
          return urlData.searchParams;
        }
      }

      return null;
    }

    const data = getUrlParts(pageUrl);

    const state = data?.get('state');
    const code = data?.get('code');

    if (state && code) {
      return {
        code,
        state,
      };
    }

    const error = data?.get('error');
    const errorDescription = data?.get('error_description');

    if (state && error) {
      throw new AuthorizationResponseException(error, errorDescription || 'Login failed at the Authorization Server');
    }

    return {
      code: null,
      state: null,
    };
  }
}
