import { MessageResponse } from '@goalie/common';
import { Controller, HttpStatus, Logger } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GetUserDto } from './dto/get-user.dto';
import { User } from './entities/user.entity';
import { GetUserQuery } from './queries/get-user.query';
import { GetUsersQuery } from './queries/get-users.query';

@Controller()
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  public constructor(private readonly queryBus: QueryBus) {}

  @MessagePattern('getUsers')
  public async getUsers(): Promise<MessageResponse<User[]>> {
    this.logger.log('Received getUsers query');
    const query = new GetUsersQuery();
    const users = await this.queryBus.execute<GetUsersQuery, User[] | null>(query);
    return new MessageResponse(HttpStatus.OK, users);
  }

  @MessagePattern('getUser')
  public async getUser(@Payload() payload: GetUserDto): Promise<MessageResponse<User>> {
    this.logger.log(`Received getUser query: ${JSON.stringify(payload)}`);

    const query = new GetUserQuery(payload);

    const user = await this.queryBus.execute<GetUserQuery, User | null>(query);

    if (!user) {
      return new MessageResponse(HttpStatus.NOT_FOUND, null, 'User not found');
    }

    return new MessageResponse(HttpStatus.OK, user);
  }
}
