import { GetGoalsDto } from '@goalie/shared/goals';
import { IQuery } from '@nestjs/cqrs';

/**
 * The get goals query. This query is responsible for getting goals for a user.
 */
export class GetGoalsQuery implements IQuery {
  public readonly userId?: string;

  public constructor(payload: GetGoalsDto) {
    this.userId = payload.userId;
  }
}
