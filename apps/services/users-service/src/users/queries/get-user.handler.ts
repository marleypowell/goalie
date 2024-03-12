import { gql } from '@apollo/client/core';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ApolloClientService } from '../../common/apollo-client.service';
import { UserManagementService } from '../../common/user-management.service';
import { Config } from '../../config/config.interface';
import { AccountInfoFields } from '../AccountInfo.gql';
import { User } from '../entities/user.entity';
import { GetUserQuery } from './get-user.query';

/**
 * The get user query handler. It is used to handle the get user query.
 */
@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  private readonly logger = new Logger(GetUserHandler.name);

  private readonly client = this.apolloClientService.createApolloClient();

  public constructor(
    private readonly apolloClientService: ApolloClientService,
    private readonly config: ConfigService<Config>,
    private readonly userManagementService: UserManagementService
  ) {}

  /**
   * Handle the get user query. It is used to get a user by id.
   * @param query the query
   * @returns the user
   */
  public async execute(query: GetUserQuery): Promise<User | null> {
    this.logger.log('received getUser query');

    const userManagementUseGraphQL = this.config.get('userManagementUseGraphQL', false, { infer: true });
    this.logger.debug(`userManagementUseGraphQL: ${userManagementUseGraphQL}`);

    if (userManagementUseGraphQL) {
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
          id: query.userId,
        },
      });

      if (!result.data?.accountById) {
        return null;
      }

      const { __typename, ...user } = result.data.accountById;

      if (!user) {
        return null;
      }

      return user;
    }

    return await this.userManagementService.getUser(query.userId);
  }
}
