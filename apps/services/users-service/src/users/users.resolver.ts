import { QueryBus } from '@nestjs/cqrs';
import { Args, Query, Resolver, ResolveReference } from '@nestjs/graphql';
import { GetUserQuery } from './queries/get-user.query';
import { GetUsersQuery } from './queries/get-users.query';

/**
 * The users resolver. It is used to handle the users routes.
 */
@Resolver('User')
export class UsersResolver {
  public constructor(private readonly queryBus: QueryBus) {}

  /**
   * Handle the get user route. It is used to get a user by id.
   * @param id the user id
   * @returns the user
   */
  @Query('user')
  public user(@Args('id') id: string) {
    return this.queryBus.execute(new GetUserQuery({ userId: id }));
  }

  /**
   * Handle the get users route. It is used to get all users.
   * @returns the users
   */
  @Query('users')
  public users() {
    return this.queryBus.execute(new GetUsersQuery());
  }

  /**
   * Resolve the user reference.
   * @param user the user
   * @returns the user
   */
  @ResolveReference()
  public __resolveReference(user: { __typename: string; id: string }) {
    return this.queryBus.execute(new GetUserQuery({ userId: user.id }));
  }
}
