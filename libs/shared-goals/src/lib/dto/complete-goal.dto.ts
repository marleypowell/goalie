import { IsUUID } from 'class-validator';

export class CompleteGoalDto {
  @IsUUID()
  public goalId: string;
}
