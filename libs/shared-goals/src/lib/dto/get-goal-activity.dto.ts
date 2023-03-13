import { IsUUID } from 'class-validator';

export class GetGoalActivityDto {
  @IsUUID()
  public goalId: string;

  public constructor(goalId: string) {
    this.goalId = goalId;
  }
}
