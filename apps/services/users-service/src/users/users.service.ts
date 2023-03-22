import { ApolloClient, createHttpLink, gql, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, map } from 'rxjs';
import { Config } from '../config/config.interface';
import { AccountInfoFields } from './AccountInfo.gql';

@Injectable()
export class UsersService {
  private readonly client: ApolloClient<NormalizedCacheObject> = this.createApolloClient();

  public constructor(private readonly config: ConfigService<Config>, private readonly http: HttpService) {}

  public async findAll() {
    const result = await this.client.query({
      query: gql`
        ${AccountInfoFields}

        query getAccounts {
          accounts {
            edges {
              node {
                ...AccountInfoFields
              }
            }
          }
        }
      `,
    });

    return result.data.accounts.edges.map((edge) => edge.node);
  }

  public async findOne(id: string) {
    const result = await this.client.query({
      query: gql`
        ${AccountInfoFields}

        query findAccount($id: String!) {
          accountById(accountId: $id) {
            ...AccountInfoFields
          }
        }
      `,
      variables: {
        id,
      },
    });

    const { __typename, ...user } = result.data.accountById;

    return user;
  }

  private createApolloClient(): ApolloClient<NormalizedCacheObject> {
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
              map((response) => {
                console.log(response.data);
                return {
                  headers: response.headers,
                  status: response.status,
                  statusText: response.statusText,
                  text: () => Promise.resolve(JSON.stringify(response.data)),
                } as any;
              })
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
