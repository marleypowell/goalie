import {
  CompleteGoalCommand,
  CompleteGoalDto,
  CreateGoalCommand,
  CreateGoalDto,
  GetGoalActivityDto,
  GetGoalDto,
  GetGoalsDto,
  Goal,
  GoalActivity,
} from '@goalie/shared/goals';
import { Controller, HttpStatus, Logger } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GetGoalActivityQuery } from './queries/get-goal-activity.query';
import { GetGoalQuery } from './queries/get-goal.query';
import { GetGoalsQuery } from './queries/get-goals.query';

@Controller()
export class GoalsController {
  private readonly logger = new Logger(GoalsController.name);

  public constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  @MessagePattern('createGoal')
  public async create(@Payload() payload: CreateGoalDto) {
    this.logger.log(`Received createGoal command: ${JSON.stringify(payload)}`);
    const command = new CreateGoalCommand(payload);
    await this.commandBus.execute(command);
    return { status: HttpStatus.CREATED, data: command.goalId, error: null };
  }

  @MessagePattern('completeGoal')
  public async complete(@Payload() payload: CompleteGoalDto) {
    this.logger.log(`Received completeGoal command: ${JSON.stringify(payload)}`);
    const command = new CompleteGoalCommand(payload);
    await this.commandBus.execute(command);
    return { status: HttpStatus.OK, data: 'SUCCESS', error: null };
  }

  @MessagePattern('getGoals')
  public async getGoals(@Payload() payload: GetGoalsDto) {
    this.logger.log('Received getGoals query');
    const query = new GetGoalsQuery(payload);
    const goals = await this.queryBus.execute<GetGoalsQuery, Goal[] | null>(query);
    return { status: HttpStatus.OK, data: goals, error: null };
  }

  @MessagePattern('getGoal')
  public async getGoal(@Payload() payload: GetGoalDto) {
    this.logger.log(`Received getGoal query: ${JSON.stringify(payload)}`);
    const query = new GetGoalQuery(payload);
    const goal = await this.queryBus.execute<GetGoalQuery, Goal | null>(query);
    return { status: HttpStatus.OK, data: goal, error: null };
  }

  @MessagePattern('getGoalActivity')
  public async getGoalActivity(@Payload() payload: GetGoalActivityDto) {
    this.logger.log(`Received getGoalActivity query: ${JSON.stringify(payload)}`);
    const query = new GetGoalActivityQuery(payload);
    const goalActivity = await this.queryBus.execute<GetGoalActivityQuery, GoalActivity[] | null>(query);
    return { status: HttpStatus.OK, data: goalActivity, error: null };
  }
}
