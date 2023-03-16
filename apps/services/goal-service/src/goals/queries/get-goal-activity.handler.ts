import { GoalActivity } from '@goalie/shared/goals';
import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GoalRepository } from '../goal.repository';
import { GetGoalActivityQuery } from './get-goal-activity.query';

@QueryHandler(GetGoalActivityQuery)
export class GetGoalActivityHandler implements IQueryHandler<GetGoalActivityQuery> {
  private readonly logger = new Logger(GetGoalActivityHandler.name);

  public constructor(private readonly goalRepository: GoalRepository) {}

  public async execute(query: GetGoalActivityQuery): Promise<GoalActivity[] | null> {
    this.logger.log('received getGoalActivity query');

    const goal = await this.goalRepository.findOne(query.goalId);

    if (!goal) {
      return null;
    }

    const activity = await this.goalRepository.getGoalActivity(query.goalId);

    if (!activity) {
      return null;
    }

    return activity;
  }
}
