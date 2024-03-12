import { ApolloClient, createHttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, map } from 'rxjs';
import { Config } from '../config/config.interface';
import { UserManagementService } from './user-management.service';

/**
 * The apollo client service.
 * It is used to create an apollo client.
 * The apollo client is used to communicate with the user management service.
 */
@Injectable()
export class ApolloClientService {
  public constructor(
    private readonly config: ConfigService<Config>,
    private readonly http: HttpService,
    private readonly userManagementService: UserManagementService
  ) {}

  /**
   * Create an apollo client. The apollo client is used to communicate with the user management service.
   * @returns the apollo client
   */
  public createApolloClient(): ApolloClient<NormalizedCacheObject> {
    const asyncAuthLink = setContext(async () => {
      const accessToken = await this.userManagementService.getAccessToken();
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
}
