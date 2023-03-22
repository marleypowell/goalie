import { gql } from '@apollo/client';
import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ApolloClientService } from '../../common/apollo-client.service';
import { AccountInfoFields } from '../AccountInfo.gql';
import { User } from '../entities/user.entity';
import { GetUsersQuery } from './get-users.query';

@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
  private readonly logger = new Logger(GetUsersHandler.name);

  private readonly client = this.apolloClientService.createApolloClient();

  public constructor(private readonly apolloClientService: ApolloClientService) {}

  public async execute(_query: GetUsersQuery): Promise<User[]> {
    this.logger.log('received getUsers query');

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
}
