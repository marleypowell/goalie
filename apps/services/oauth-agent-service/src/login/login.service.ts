import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { CookieService } from '../lib/cookie.service';
import { CurityService } from '../lib/curity.service';
import AuthorizationResponseException from '../lib/exceptions/AuthorizationResponseException';
import InvalidStateException from '../lib/exceptions/InvalidStateException';
import MissingTempLoginDataException from '../lib/exceptions/MissingTempLoginDataException';
import { generateRandomString } from '../lib/generate-random-string';
import { AuthState } from './models/auth-state';
import { LoginEndResponse } from './models/login-end-response.model';
import { LoginStartResponse } from './models/login-start-response.model';

/**
 * The login service. It is used to start and end the login process.
 */
@Injectable()
export class LoginService {
  public constructor(private readonly curityService: CurityService, private readonly cookieService: CookieService) {}

  /**
   * Start the login process.
   * @param path The path.
   * @returns the login start response.
   */
  public loginStart(path: string): LoginStartResponse & { tempLoginDataCookie: string } {
    const state = new AuthState(path).toString();
    const codeVerifier = generateRandomString();
    return {
      authorizationRequestUrl: this.curityService.createAuthorizationRequestUrl(state, codeVerifier),
      tempLoginDataCookie: this.cookieService.createTempLoginDataCookie(codeVerifier, state),
    };
  }

  /**
   * End the login process.
   * @param pageUrl The page url.
   * @param cookies The cookies.
   * @returns the login end response.
   */
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

    const authState = AuthState.fromString(data.state);

    const tokenResponse = await firstValueFrom(this.curityService.getToken(data.code, tempLoginData.codeVerifier));

    // TODO: Implement ID token validation
    // if (tokenResponse.id_token) {
    // validateIDtoken(config, tokenResponse.id_token);
    // }

    const cookiesToSet = this.cookieService.getTokenResponseCookies(tokenResponse, true);

    return {
      isLoggedIn: true,
      handled: true,
      path: authState.path,
      cookiesToSet,
    };
  }

  /**
   * Decode the page url. It will return the code and state if they are present.
   * @param pageUrl The page url.
   * @returns the code and state.
   */
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
