import { IsNotEmpty, IsString } from 'class-validator';

export class GetGoalsDto {
  @IsString()
  @IsNotEmpty()
  public userId: string;

  public constructor(userId: string) {
    this.userId = userId;
  }
}
