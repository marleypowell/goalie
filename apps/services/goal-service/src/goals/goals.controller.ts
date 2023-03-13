import { Controller, HttpStatus, Logger } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CompleteGoalCommand } from './commands/complete-goal.command';
import { CreateGoalCommand } from './commands/create-goal.command';
import { CompleteGoalDto } from './dto/complete-goal.dto';
import { CreateGoalDto } from './dto/create-goal.dto';
import { GetGoalActivityDto } from './dto/get-goal-activity.dto';
import { GetGoalDto } from './dto/get-goal.dto';
import { GoalActivity } from './entities/goal-activity.entity';
import { Goal } from './entities/goal.entity';
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
    const command = new CreateGoalCommand(this.getUserId(), payload);
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
  public async getGoals() {
    this.logger.log('Received getGoals query');
    const query = new GetGoalsQuery();
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

  private getUserId(): string {
    return 'user1';
  }
}
