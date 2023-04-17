import { Goal } from '@goalie/shared/goals';
import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GoalsRepository } from '../goals.repository';
import { GetGoalQuery } from './get-goal.query';

/**
 * The get goal query handler. This handler is responsible for getting a goal by id.
 */
@QueryHandler(GetGoalQuery)
export class GetGoalHandler implements IQueryHandler<GetGoalQuery> {
  private readonly logger = new Logger(GetGoalHandler.name);

  public constructor(private readonly goalRepository: GoalsRepository) {}

  /**
   * Get the goal by id. Return null if no goal is found.
   * @param query the query
   * @returns the goal
   */
  public async execute(query: GetGoalQuery): Promise<Goal | null> {
    this.logger.log('received getGoal query');
    const goal = await this.goalRepository.findOne(query.goalId);

    if (!goal) {
      return null;
    }

    return goal;
  }
}
