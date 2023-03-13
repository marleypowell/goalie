import { IsUUID } from 'class-validator';

export class GetGoalDto {
  @IsUUID()
  public goalId: string;

  public constructor(goalId: string) {
    this.goalId = goalId;
  }
}
