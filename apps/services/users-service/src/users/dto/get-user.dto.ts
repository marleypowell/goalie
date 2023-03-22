import { IsUUID } from 'class-validator';

export class GetUserDto {
  @IsUUID()
  public userId: string;

  public constructor(userId: string) {
    this.userId = userId;
  }
}
