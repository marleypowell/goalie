import { Goal } from '@goalie/shared/goals';
import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GoalsRepository } from '../goals.repository';
import { GetGoalsQuery } from './get-goals.query';

/**
 * The get goals query handler. This handler is responsible for getting all goals.
 */
@QueryHandler(GetGoalsQuery)
export class GetGoalsHandler implements IQueryHandler<GetGoalsQuery> {
  private readonly logger = new Logger(GetGoalsHandler.name);

  public constructor(private readonly goalRepository: GoalsRepository) {}

  /**
   * Get all goals. Optionally filter by user id.
   * @param query the query
   * @returns the goals
   */
  public async execute(query: GetGoalsQuery): Promise<Goal[]> {
    this.logger.log('received getGoals query');
    let goals = await this.goalRepository.findAll();

    goals = goals.filter((goal) => !goal.goalDeleted);

    if (query.userId) {
      goals = goals.filter((goal) => goal.userId === query.userId);
    }

    return goals;
  }
}
