import { QueryBus } from '@nestjs/cqrs';
import { Args, Query, Resolver, ResolveReference } from '@nestjs/graphql';
import { GetUserQuery } from './queries/get-user.query';
import { GetUsersQuery } from './queries/get-users.query';

@Resolver('User')
export class UsersResolver {
  public constructor(private readonly queryBus: QueryBus) {}

  @Query('user')
  public user(@Args('id') id: string) {
    return this.queryBus.execute(new GetUserQuery({ userId: id }));
  }

  @Query('users')
  public users() {
    return this.queryBus.execute(new GetUsersQuery());
  }

  @ResolveReference()
  public __resolveReference(user: { __typename: string; id: string }) {
    return this.queryBus.execute(new GetUserQuery({ userId: user.id }));
  }
}
