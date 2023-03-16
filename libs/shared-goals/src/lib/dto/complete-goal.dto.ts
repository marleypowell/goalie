import { IsUUID } from 'class-validator';

export class CompleteGoalDto {
  @IsUUID()
  public goalId: string;

  public constructor(goalId: string) {
    this.goalId = goalId;
  }
}
