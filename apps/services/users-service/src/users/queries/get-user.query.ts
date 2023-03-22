import { IQuery } from '@nestjs/cqrs';
import { GetUserDto } from '../dto/get-user.dto';

export class GetUserQuery implements IQuery {
  public readonly userId: string;

  public constructor(payload: GetUserDto) {
    this.userId = payload.userId;
  }
}
