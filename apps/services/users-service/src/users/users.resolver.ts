import { Args, Query, Resolver, ResolveReference } from '@nestjs/graphql';
import { UsersService } from './users.service';

@Resolver('User')
export class UsersResolver {
  public constructor(private readonly usersService: UsersService) {}

  @Query('users')
  public findAll() {
    return this.usersService.findAll();
  }

  @Query('user')
  public findOne(@Args('id') id: string) {
    return this.usersService.findOne(id);
  }

  @ResolveReference()
  public __resolveReference(user: { __typename: string; id: string }) {
    return this.usersService.findOne(user.id);
  }
}
