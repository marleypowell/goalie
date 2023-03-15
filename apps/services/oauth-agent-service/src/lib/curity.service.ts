import { HttpModule, HttpService } from '@nestjs/axios';
import { HttpException, Injectable, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { isAxiosError } from 'axios';
import { catchError, map, Observable } from 'rxjs';
import { Config } from '../config/config.interface';
import AuthorizationClientException from './exceptions/AuthorizationClientException';
import AuthorizationServerException from './exceptions/AuthorizationServerException';
import { generateHash } from './generate-hash';
import { Grant } from './grant';
import { TokenResponse } from './token-response';
import { UserInfo } from './user-info';

/**
 * Service for interacting with the Curity OAuth 2.0 server.
 */
@Injectable()
export class CurityService {
  public constructor(private readonly configService: ConfigService<Config>, private readonly http: HttpService) {}

  /**
   * Get a token from the token endpoint using the Authorization Code Grant.
   * @param code the authorization code.
   * @param codeVerifier the code verifier used to generate the code challenge.
   * @returns the token response.
   */
  public getToken(code: string, codeVerifier: string): Observable<TokenResponse> {
    const tokenEndpoint = this.configService.get('tokenEndpoint', { infer: true });
    const clientID = this.configService.get('clientID', { infer: true });
    const clientSecret = this.configService.get('clientSecret', { infer: true });
    const redirectUri = this.configService.get('redirectUri', { infer: true });

    return this.http
      .post<TokenResponse>(
        tokenEndpoint,
        `grant_type=authorization_code&redirect_uri=${redirectUri}&code=${code}&code_verifier=${codeVerifier}`,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(clientID + ':' + clientSecret).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )
      .pipe(
        map((res) => {
          if (res.status >= 500) {
            const error = new AuthorizationServerException();
            error.logInfo = `Server error response in an Authorization Code Grant: ${res.data}`;
            throw error;
          }

          if (res.status >= 400) {
            throw new AuthorizationClientException(Grant.AuthorizationCode, res.status, String(res.data));
          }

          return res.data;
        }),
        catchError((err) => {
          if (isAxiosError(err)) {
            throw new HttpException(err.response.data, err.response.status, {
              cause: err.cause,
              description: err.message,
            });
          }
          throw err;
        })
      );
  }

  /**
   * Get a token from the token endpoint using the Refresh Token Grant.
   * @param refreshToken the refresh token.
   * @returns the token response.
   */
  public getRefreshToken(refreshToken: string): Observable<TokenResponse> {
    const tokenEndpoint = this.configService.get('tokenEndpoint', { infer: true });
    const clientID = this.configService.get('clientID', { infer: true });
    const clientSecret = this.configService.get('clientSecret', { infer: true });

    return this.http
      .post<TokenResponse>(tokenEndpoint, `grant_type=refresh_token&refresh_token=${refreshToken}`, {
        headers: {
          Authorization: `Basic ${Buffer.from(clientID + ':' + clientSecret).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .pipe(
        map((res) => {
          if (res.status >= 500) {
            const error = new AuthorizationServerException();
            error.logInfo = `Server error response in an Authorization Code Grant: ${res.data}`;
            throw error;
          }

          if (res.status >= 400) {
            throw new AuthorizationClientException(Grant.AuthorizationCode, res.status, String(res.data));
          }

          return res.data;
        }),
        catchError((err) => {
          if (isAxiosError(err)) {
            throw new HttpException(err.response.data, err.response.status, {
              cause: err.cause,
              description: err.message,
            });
          }
          throw err;
        })
      );
  }

  /**
   * Get user info from the user info endpoint.
   * @param accessToken the access token.
   * @returns the user info.
   */
  public getUserInfo(accessToken: string): Observable<UserInfo> {
    const userInfoEndpoint = this.configService.get('userInfoEndpoint', { infer: true });

    return this.http
      .post<UserInfo>(userInfoEndpoint, null, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .pipe(
        map((res) => {
          if (res.status >= 500) {
            const error = new AuthorizationServerException();
            error.logInfo = `Server error response in an Authorization Code Grant: ${res.data}`;
            throw error;
          }

          if (res.status >= 400) {
            throw new AuthorizationClientException(Grant.AuthorizationCode, res.status, String(res.data));
          }

          return res.data;
        }),
        catchError((err) => {
          if (isAxiosError(err)) {
            throw new HttpException(err.response.data, err.response.status, {
              cause: err.cause,
              description: err.message,
            });
          }
          throw err;
        })
      );
  }

  public createAuthorizationRequestUrl(state: string, codeVerifier: string): string {
    const authorizeEndpoint = this.configService.get('authorizeEndpoint', { infer: true });
    const clientId = this.configService.get('clientID', { infer: true });
    const redirectUri = this.configService.get('redirectUri', { infer: true });

    let authorizationRequestUrl =
      authorizeEndpoint +
      '?client_id=' +
      encodeURIComponent(clientId) +
      '&redirect_uri=' +
      encodeURIComponent(redirectUri) +
      '&response_type=code' +
      '&state=' +
      encodeURIComponent(state) +
      '&code_challenge=' +
      generateHash(codeVerifier) +
      '&code_challenge_method=S256';

    const scope = this.configService.get('scope', { infer: true });

    if (scope) {
      authorizationRequestUrl += '&scope=' + encodeURIComponent(scope);
    }

    return authorizationRequestUrl;
  }

  public createLogoutRequestUrl(): string {
    const logoutEndpoint = this.configService.get('logoutEndpoint', { infer: true });
    const postLogoutRedirectUri = this.configService.get('postLogoutRedirectURI', { infer: true });
    const clientId = this.configService.get('clientID', { infer: true });

    const postLogoutRedirectUriParam = postLogoutRedirectUri
      ? '&post_logout_redirect_uri=' + encodeURIComponent(postLogoutRedirectUri)
      : '';

    return logoutEndpoint + '?client_id=' + encodeURIComponent(clientId) + postLogoutRedirectUriParam;
  }
}

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [CurityService],
  exports: [CurityService],
})
export class CurityModule {}
