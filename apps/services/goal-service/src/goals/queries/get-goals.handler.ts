import { Goal } from '@goalie/shared/goals';
import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GoalRepository } from '../goal.repository';
import { GetGoalsQuery } from './get-goals.query';

@QueryHandler(GetGoalsQuery)
export class GetGoalsHandler implements IQueryHandler<GetGoalsQuery> {
  private readonly logger = new Logger(GetGoalsHandler.name);

  public constructor(private readonly goalRepository: GoalRepository) {}

  public async execute(): Promise<Goal[]> {
    this.logger.log('received getGoals query');
    return this.goalRepository.findAll();
  }
}
