import { Goal } from '@goalie/shared/goals';
import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GoalRepository } from '../goal.repository';
import { GetGoalQuery } from './get-goal.query';

@QueryHandler(GetGoalQuery)
export class GetGoalHandler implements IQueryHandler<GetGoalQuery> {
  private readonly logger = new Logger(GetGoalHandler.name);

  public constructor(private readonly goalRepository: GoalRepository) {}

  public async execute(query: GetGoalQuery): Promise<Goal> {
    this.logger.log('received getGoal query');
    return this.goalRepository.findOne(query.goalId);
  }
}