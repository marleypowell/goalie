import { gql } from '@apollo/client/core';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ApolloClientService } from '../../common/apollo-client.service';
import { UserManagementService } from '../../common/user-management.service';
import { Config } from '../../config/config.interface';
import { AccountInfoFields } from '../AccountInfo.gql';
import { User } from '../entities/user.entity';
import { GetUsersQuery } from './get-users.query';

/**
 * The get users query handler. It is used to handle the get users query.
 */
@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
  private readonly logger = new Logger(GetUsersHandler.name);

  private readonly client = this.apolloClientService.createApolloClient();

  public constructor(
    private readonly apolloClientService: ApolloClientService,
    private readonly config: ConfigService<Config>,
    private readonly userManagementService: UserManagementService
  ) {}

  /**
   * Handle the get users query. It is used to get all users.
   * @param _query the query
   * @returns the users
   */
  public async execute(_query: GetUsersQuery): Promise<User[]> {
    this.logger.log('received getUsers query');

    const userManagementUseGraphQL = this.config.get('userManagementUseGraphQL', false, { infer: true });
    this.logger.debug(`userManagementUseGraphQL: ${userManagementUseGraphQL}`);

    if (userManagementUseGraphQL) {
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

    return await this.userManagementService.getUsers();
  }
}
