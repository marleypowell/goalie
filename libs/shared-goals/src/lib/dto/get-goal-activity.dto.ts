import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class GetGoalActivityDto {
  @IsString()
  @IsNotEmpty()
  public userId: string;

  @IsUUID()
  public goalId: string;

  public constructor(userId: string, goalId: string) {
    this.userId = userId;
    this.goalId = goalId;
  }
}
