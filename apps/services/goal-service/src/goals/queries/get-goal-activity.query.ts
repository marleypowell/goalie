import { GetGoalActivityDto } from '@goalie/shared/goals';
import { IQuery } from '@nestjs/cqrs';

export class GetGoalActivityQuery implements IQuery {
  public readonly goalId: string;

  public constructor(payload: GetGoalActivityDto) {
    this.goalId = payload.goalId;
  }
}
