import { ApolloClient, createHttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, map } from 'rxjs';
import { Config } from '../config/config.interface';

@Injectable()
export class ApolloClientService {
  public constructor(private readonly config: ConfigService<Config>, private readonly http: HttpService) {}

  public createApolloClient(): ApolloClient<NormalizedCacheObject> {
    const asyncAuthLink = setContext(async () => {
      const accessToken = await this.getAccessToken();
      return {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
    });

    const userManagementEndpoint = this.config.get('userManagementEndpoint', { infer: true });

    const httpLink = createHttpLink({
      uri: userManagementEndpoint,
      fetch: async (uri, options) =>
        firstValueFrom(
          this.http
            .request({
              url: uri.toString(),
              method: options.method,
              headers: options.headers as any,
              data: options.body,
            })
            .pipe(
              map(
                (response) =>
                  ({
                    headers: response.headers,
                    status: response.status,
                    statusText: response.statusText,
                    text: () => Promise.resolve(JSON.stringify(response.data)),
                  } as any)
              )
            )
        ),
    });

    return new ApolloClient({
      link: asyncAuthLink.concat(httpLink),
      cache: new InMemoryCache(),
    });
  }

  private getAccessToken(): Promise<string> {
    const { clientId, clientSecret } = this.config.get('accountsClientOptions', { infer: true });
    return firstValueFrom(
      this.http
        .post(
          'https://login.mp.exclaimertest.net/oauth/v2/oauth-token',
          `grant_type=client_credentials&scope=accounts&client_id=${clientId}&client_secret=${clientSecret}`,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        )
        .pipe(map((res) => String(res.data['access_token'])))
    );
  }
}
