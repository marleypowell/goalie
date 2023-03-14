import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CompleteGoalDto {
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
