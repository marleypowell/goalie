import { GetGoalActivityDto } from '@goalie/shared/goals';
import { IQuery } from '@nestjs/cqrs';

/**
 * The get goal activity query. This query is responsible for getting the activity for a goal.
 */
export class GetGoalActivityQuery implements IQuery {
  public readonly goalId: string;

  public constructor(payload: GetGoalActivityDto) {
    this.goalId = payload.goalId;
  }
}
