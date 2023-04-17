import { IQuery } from '@nestjs/cqrs';
import { GetUserDto } from '../dto/get-user.dto';

/**
 * The get user query. It is used to get a user by id.
 */
export class GetUserQuery implements IQuery {
  public readonly userId: string;

  public constructor(payload: GetUserDto) {
    this.userId = payload.userId;
  }
}
