import { IQuery } from '@nestjs/cqrs';
import { GetGoalActivityDto } from '../dto/get-goal-activity.dto';

export class GetGoalActivityQuery implements IQuery {
  public readonly goalId: string;

  public constructor(payload: GetGoalActivityDto) {
    this.goalId = payload.goalId;
  }
}
