import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GoalActivity } from '../entities/goal-activity.entity';
import { GoalRepository } from '../goal.repository';
import { GetGoalActivityQuery } from './get-goal-activity.query';

@QueryHandler(GetGoalActivityQuery)
export class GetGoalActivityHandler implements IQueryHandler<GetGoalActivityQuery> {
  private readonly logger = new Logger(GetGoalActivityHandler.name);

  public constructor(private readonly goalRepository: GoalRepository) {}

  public async execute(query: GetGoalActivityQuery): Promise<GoalActivity[]> {
    this.logger.log('received getGoalActivity query');
    return this.goalRepository.findOneActivity(query.goalId);
  }
}
