import { gql } from '@apollo/client';
import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ApolloClientService } from '../../common/apollo-client.service';
import { AccountInfoFields } from '../AccountInfo.gql';
import { User } from '../entities/user.entity';
import { GetUserQuery } from './get-user.query';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  private readonly logger = new Logger(GetUserHandler.name);

  private readonly client = this.apolloClientService.createApolloClient();

  public constructor(private readonly apolloClientService: ApolloClientService) {}

  public async execute(query: GetUserQuery): Promise<User | null> {
    this.logger.log('received getUser query');

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

    const { __typename, ...user } = result.data.accountById;

    if (!user) {
      return null;
    }

    return user;
  }
}
