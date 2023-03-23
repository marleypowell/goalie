import { IsString } from 'class-validator';

export class GetGoalsDto {
  @IsString()
  public userId?: string;

  public constructor(userId?: string) {
    this.userId = userId;
  }
}
