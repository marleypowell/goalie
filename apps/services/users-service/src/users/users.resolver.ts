import { Args, Query, Resolver, ResolveReference } from '@nestjs/graphql';
import { UsersService } from './users.service';

@Resolver('User')
export class UsersResolver {
  public constructor(private readonly usersService: UsersService) {}

  @Query('user')
  public user(@Args('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Query('users')
  public users() {
    return this.usersService.findAll();
  }

  @ResolveReference()
  public __resolveReference(user: { __typename: string; id: string }) {
    return this.usersService.findOne(user.id);
  }
}
