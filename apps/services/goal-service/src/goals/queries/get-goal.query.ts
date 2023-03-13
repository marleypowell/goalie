import { IQuery } from '@nestjs/cqrs';
import { GetGoalDto } from '../dto/get-goal.dto';

export class GetGoalQuery implements IQuery {
  public readonly goalId: string;

  public constructor(payload: GetGoalDto) {
    this.goalId = payload.goalId;
  }
}
