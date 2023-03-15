import { Injectable, Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CookieSerializeOptions, serialize } from 'cookie';
import { Config } from '../config/config.interface';
import { CookieEncryptionService } from './cookie-encryption.service';
import { TempLoginData } from './temp-login-data';
import { TokenResponse } from './token-response';

const DAY_MILLISECONDS = 1000 * 60 * 60 * 24;

/**
 * Service for handling cookies.
 */
@Injectable()
export class CookieService {
  private readonly logger = new Logger(CookieService.name);

  private readonly cookieNamePrefix = this.configService.get('cookieNamePrefix', { infer: true });

  private readonly endpointsPrefix = this.configService.get('endpointsPrefix', { infer: true });

  private readonly cookieNames = {
    tempLogin: `${this.cookieNamePrefix}-login`,
    refreshToken: `${this.cookieNamePrefix}-refresh-token`,
    accessToken: `${this.cookieNamePrefix}-at`,
    idToken: `${this.cookieNamePrefix}-id-token`,
  };

  public constructor(
    private readonly configService: ConfigService<Config>,
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
      this.logger.debug('Unsetting temp login data cookie');
      cookies.push(this.createExpiredCookie(this.cookieNames.tempLogin));
    }

    if (tokenResponse.refresh_token) {
      this.logger.debug('Setting refresh token cookie');
      cookies.push(
        this.cookieEncryptionService.createEncryptedCookie(this.cookieNames.refreshToken, tokenResponse.refresh_token, {
          path: this.endpointsPrefix + '/refresh-token',
        })
      );
    } else {
      this.logger.debug('No refresh token in response');
    }

    if (tokenResponse.id_token) {
      this.logger.debug('Setting id token cookie');
      cookies.push(
        this.cookieEncryptionService.createEncryptedCookie(this.cookieNames.idToken, tokenResponse.id_token, {
          path: this.endpointsPrefix + '/claims',
        })
      );
    } else {
      this.logger.debug('No id token in response');
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

  /**
   * Gets the refresh token from the cookies.
   * @param cookies The cookies.
   * @returns The refresh token.
   */
  public getRefreshTokenCookie(cookies: Record<string, string>): string | undefined {
    return this.getCookie(cookies, this.cookieNames.refreshToken);
  }

  /**
   * Gets the id token from the cookies.
   * @param cookies The cookies.
   * @returns The id token.
   */
  public getIdTokenCookie(cookies: Record<string, string>): string | undefined {
    return this.getCookie(cookies, this.cookieNames.idToken);
  }

  /**
   * Gets the cookies for unsetting the auth, access token and id cookies.
   */
  public getLogoutCookies(): string[] {
    return [
      this.createExpiredCookie(this.cookieNames.refreshToken),
      this.createExpiredCookie(this.cookieNames.accessToken),
      this.createExpiredCookie(this.cookieNames.idToken),
    ];
  }

  private createExpiredCookie(name: string): string {
    const defaultCookieOptions = this.configService.get('cookieOptions', { infer: true });
    const cookieOptions: CookieSerializeOptions = {
      ...defaultCookieOptions,
      expires: new Date(Date.now() - DAY_MILLISECONDS),
    };
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

@Module({
  imports: [ConfigModule],
  providers: [CookieService, CookieEncryptionService],
  exports: [CookieService, CookieEncryptionService],
})
export class CookieModule {}
