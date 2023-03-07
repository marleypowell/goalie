import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, map, Observable } from 'rxjs';
import AuthorizationClientException from './exceptions/AuthorizationClientException';
import AuthorizationServerException from './exceptions/AuthorizationServerException';
import { OAuthAgentException } from './exceptions/OAuthAgentException';
import { generateHash } from './generate-hash';
import { Grant } from './grant';
import { TokenResponse } from './token-response';
import { UserInfo } from './user-info';

/**
 * Service for interacting with the Curity OAuth 2.0 server.
 */
@Injectable()
export class CurityService {
  public constructor(private readonly configService: ConfigService, private readonly http: HttpService) {}

  /**
   * Get a token from the token endpoint using the Authorization Code Grant.
   * @param code the authorization code.
   * @param codeVerifier the code verifier used to generate the code challenge.
   * @returns the token response.
   */
  public getToken(code: string, codeVerifier: string): Observable<TokenResponse> {
    const tokenEndpoint = this.configService.get<string>('tokenEndpoint');
    const clientID = this.configService.get<string>('clientID');
    const clientSecret = this.configService.get<string>('clientSecret');
    const redirectUri = this.configService.get<string>('redirectUri');

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
          if (!(err instanceof OAuthAgentException)) {
            const error = new AuthorizationServerException(err);
            error.logInfo = 'Connectivity problem during an Authorization Code Grant';
            throw error;
          } else {
            throw err;
          }
        })
      );
  }

  /**
   * Get a token from the token endpoint using the Refresh Token Grant.
   * @param refreshToken the refresh token.
   * @returns the token response.
   */
  public getRefreshToken(refreshToken: string): Observable<TokenResponse> {
    const tokenEndpoint = this.configService.get<string>('tokenEndpoint');
    const clientID = this.configService.get<string>('clientID');
    const clientSecret = this.configService.get<string>('clientSecret');

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
          if (!(err instanceof OAuthAgentException)) {
            const error = new AuthorizationServerException(err);
            error.logInfo = 'Connectivity problem during an Authorization Code Grant';
            throw error;
          } else {
            throw err;
          }
        })
      );
  }

  /**
   * Get user info from the user info endpoint.
   * @param accessToken the access token.
   * @returns the user info.
   */
  public getUserInfo(accessToken: string): Observable<UserInfo> {
    const userInfoEndpoint = this.configService.get<string>('userInfoEndpoint');

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
          if (!(err instanceof OAuthAgentException)) {
            const error = new AuthorizationServerException(err);
            error.logInfo = 'Connectivity problem during a User Info request';
            throw error;
          } else {
            throw err;
          }
        })
      );
  }

  public createAuthorizationRequestUrl(state: string, codeVerifier: string): string {
    const authorizeEndpoint = this.configService.get<string>('authorizeEndpoint');
    const clientId = this.configService.get<string>('clientID');
    const redirectUri = this.configService.get<string>('redirectUri');

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

    const scope = this.configService.get<string>('scope');

    if (scope) {
      authorizationRequestUrl += '&scope=' + encodeURIComponent(scope);
    }

    return authorizationRequestUrl;
  }

  public createLogoutRequestUrl(): string {
    const logoutEndpoint = this.configService.get<string>('logoutEndpoint');
    const postLogoutRedirectUri = this.configService.get<string>('postLogoutRedirectURI');
    const clientId = this.configService.get<string>('clientID');

    const postLogoutRedirectUriParam = postLogoutRedirectUri
      ? '&post_logout_redirect_uri=' + encodeURIComponent(postLogoutRedirectUri)
      : '';

    return logoutEndpoint + '?client_id=' + encodeURIComponent(clientId) + postLogoutRedirectUriParam;
  }
}
