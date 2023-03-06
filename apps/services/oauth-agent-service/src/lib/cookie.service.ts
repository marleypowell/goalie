import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CookieSerializeOptions, serialize } from 'cookie';
import { CookieEncryptionService } from './cookie-encryption.service';
import { TempLoginData } from './temp-login-data';
import { TokenResponse } from './token-response';

/**
 * Service for handling cookies.
 */
@Injectable()
export class CookieService {
  private readonly cookieNamePrefix = this.configService.get<string>('cookieNamePrefix');

  private readonly endpointsPrefix = this.configService.get<string>('endpointsPrefix');

  private readonly cookieNames = {
    tempLogin: `${this.cookieNamePrefix}-login`,
    auth: `${this.cookieNamePrefix}-auth`,
    accessToken: `${this.cookieNamePrefix}-access-token`,
    id: `${this.cookieNamePrefix}-id`,
  };

  public constructor(
    private readonly configService: ConfigService,
    private readonly cookieEncryptionService: CookieEncryptionService
  ) {}

  /**
   * Gets cookies from the token response.
   * @param tokenResponse The token response.
   * @param unsetTempLoginDataCookie Whether to unset the temp login data cookie.
   * @returns The cookies.
   */
  public getTokenResponseCookies(tokenResponse: TokenResponse, unsetTempLoginDataCookie: boolean): string[] {
    const cookies: string[] = [
      this.cookieEncryptionService.createEncryptedCookie(this.cookieNames.accessToken, tokenResponse.access_token),
    ];

    if (unsetTempLoginDataCookie) {
      cookies.push(this.createExpiredCookie(this.cookieNames.tempLogin));
    }

    if (tokenResponse.refresh_token) {
      cookies.push(
        this.cookieEncryptionService.createEncryptedCookie(this.cookieNames.auth, tokenResponse.refresh_token, {
          path: this.endpointsPrefix + '/refresh',
        })
      );
    }

    if (tokenResponse.id_token) {
      cookies.push(
        this.cookieEncryptionService.createEncryptedCookie(this.cookieNames.id, tokenResponse.id_token, {
          path: this.endpointsPrefix + '/claims',
        })
      );
    }

    return cookies;
  }

  /**
   * Creates a cookie with the temp login data.
   * @param codeVerifier The code verifier.
   * @param state The state.
   * @returns The cookie.
   */
  public createTempLoginDataCookie(codeVerifier: string, state: string): string {
    return this.cookieEncryptionService.createEncryptedCookie(
      this.cookieNames.tempLogin,
      JSON.stringify({ codeVerifier, state } as TempLoginData)
    );
  }

  /**
   * Gets the temp login data from the cookies.
   * @param cookies The cookies.
   * @returns The temp login data.
   */
  public getTempLoginData(cookies: Record<string, string>): TempLoginData | undefined {
    const tempLoginData = this.getCookie(cookies, this.cookieNames.tempLogin);
    if (!tempLoginData) {
      return undefined;
    }
    return JSON.parse(tempLoginData);
  }

  /**
   * Gets the access token from the cookies.
   * @param cookies The cookies.
   * @returns The access token.
   */
  public getAccessTokenCookie(cookies: Record<string, string>): string | undefined {
    return this.getCookie(cookies, this.cookieNames.accessToken);
  }

  private createExpiredCookie(name: string): string {
    const DAY_MILLISECONDS = 1000 * 60 * 60 * 24;
    const defaultCookieOptions = this.configService.get<CookieSerializeOptions>('cookieOptions');
    const cookieOptions = { ...defaultCookieOptions, expires: new Date(Date.now() - DAY_MILLISECONDS) };
    return serialize(name, '', cookieOptions);
  }

  private getCookie(cookies: Record<string, string>, name: string): string | undefined {
    const encryptedCookie = cookies ? cookies[name] : undefined;
    if (!encryptedCookie) {
      return undefined;
    }
    return this.cookieEncryptionService.decrypt(encryptedCookie);
  }
}
