import { IsUUID } from 'class-validator';

export class GetGoalDto {
  @IsUUID()
  public goalId: string;
}
