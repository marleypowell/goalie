import { IsUUID } from 'class-validator';

export class DeleteGoalDto {
  @IsUUID()
  public goalId: string;

  public constructor(goalId: string) {
    this.goalId = goalId;
  }
}
