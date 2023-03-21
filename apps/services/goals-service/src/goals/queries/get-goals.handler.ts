import { Goal } from '@goalie/shared/goals';
import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GoalsRepository } from '../goals.repository';
import { GetGoalsQuery } from './get-goals.query';

@QueryHandler(GetGoalsQuery)
export class GetGoalsHandler implements IQueryHandler<GetGoalsQuery> {
  private readonly logger = new Logger(GetGoalsHandler.name);

  public constructor(private readonly goalRepository: GoalsRepository) {}

  public async execute(query: GetGoalsQuery): Promise<Goal[]> {
    this.logger.log('received getGoals query');
    const goals = await this.goalRepository.findAll();
    return goals.filter((goal) => goal.userId === query.userId && !goal.goalDeleted);
  }
}
