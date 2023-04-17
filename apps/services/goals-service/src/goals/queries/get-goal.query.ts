import { GetGoalDto } from '@goalie/shared/goals';
import { IQuery } from '@nestjs/cqrs';

/**
 * The get goal query. This query is responsible for getting a goal by id.
 */
export class GetGoalQuery implements IQuery {
  public readonly goalId: string;

  public constructor(payload: GetGoalDto) {
    this.goalId = payload.goalId;
  }
}
