import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, map } from 'rxjs';
import { Config } from '../config/config.interface';
import { User } from '../users/entities/user.entity';

/**
 * The user management service.
 */
@Injectable()
export class UserManagementService {
  public constructor(private readonly config: ConfigService<Config>, private readonly http: HttpService) {}

  /**
   * Get an access token. The access token is used to communicate with the user management service.
   * @returns the access token
   */
  public getAccessToken(): Promise<string> {
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

  public async getUsers(): Promise<User[]> {
    const userManagementEndpoint = this.config.get('userManagementEndpoint', { infer: true });

    const accessToken = await this.getAccessToken();

    const response = this.http.get<{ Resources: User[] }>(`${userManagementEndpoint}/Users`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return firstValueFrom(
      response.pipe(
        map((res) => {
          if (res.status !== HttpStatus.OK) {
            throw new HttpException('Error getting users ', res.status);
          }

          return res.data.Resources;
        })
      )
    );
  }

  public async getUser(userId: string): Promise<User | null> {
    const userManagementEndpoint = this.config.get('userManagementEndpoint', { infer: true });

    const accessToken = await this.getAccessToken();

    const encodedUserId = Buffer.from(`USER:${userId}`).toString('base64');

    const response = this.http.get<User>(`${userManagementEndpoint}/Users/${encodedUserId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return firstValueFrom(
      response.pipe(
        map((res) => {
          if (res.status === HttpStatus.NOT_FOUND) {
            return null;
          }

          if (res.status !== HttpStatus.OK) {
            throw new HttpException(`Error getting user ${userId}`, res.status);
          }

          const decodedUserId = Buffer.from(res.data.id, 'base64').toString().split(':')[1];

          return {
            ...res.data,
            id: decodedUserId,
          };
        })
      )
    );
  }
}
