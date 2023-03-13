import { IsUUID } from 'class-validator';

export class GetGoalActivityDto {
  @IsUUID()
  public goalId: string;
}
