import { MessageResponse } from '@goalie/common';
import {
  CheckInGoalCommand,
  CheckInGoalDto,
  CompleteGoalCommand,
  CompleteGoalDto,
  CreateGoalCommand,
  CreateGoalDto,
  DeleteGoalCommand,
  DeleteGoalDto,
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

/**
 * The goals controller is responsible for handling all requests to create, update, and delete goals.
 */
@Controller()
export class GoalsController {
  private readonly logger = new Logger(GoalsController.name);

  public constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  /**
   * Create a new goal. Returns the id of the newly created goal. This executes the create goal command.
   * @param payload the payload
   * @returns the id of the newly created goal
   */
  @MessagePattern('createGoal')
  public async create(@Payload() payload: CreateGoalDto): Promise<MessageResponse<string>> {
    this.logger.log(`Received createGoal command: ${JSON.stringify(payload)}`);
    const command = new CreateGoalCommand(payload);
    await this.commandBus.execute(command);
    return new MessageResponse(HttpStatus.CREATED, command.goalId);
  }

  /**
   * Check in to a goal. This executes the check in goal command.
   * @param payload the payload
   * @returns success
   */
  @MessagePattern('checkInGoal')
  public async checkIn(@Payload() payload: CheckInGoalDto): Promise<MessageResponse<string>> {
    this.logger.log(`Received checkInGoal command: ${JSON.stringify(payload)}`);
    const command = new CheckInGoalCommand(payload);
    await this.commandBus.execute(command);
    return new MessageResponse(HttpStatus.OK, 'SUCCESS');
  }

  /**
   * Complete a goal. This executes the complete goal command.
   * @param payload the payload
   * @returns success
   */
  @MessagePattern('completeGoal')
  public async complete(@Payload() payload: CompleteGoalDto): Promise<MessageResponse<string>> {
    this.logger.log(`Received completeGoal command: ${JSON.stringify(payload)}`);
    const command = new CompleteGoalCommand(payload);
    await this.commandBus.execute(command);
    return new MessageResponse(HttpStatus.OK, 'SUCCESS');
  }

  /**
   * Delete a goal. This executes the delete goal command.
   * @param payload the payload
   * @returns nothing
   */
  @MessagePattern('deleteGoal')
  public async delete(@Payload() payload: DeleteGoalDto): Promise<MessageResponse<undefined>> {
    this.logger.log(`Received deleteGoal command: ${JSON.stringify(payload)}`);
    const command = new DeleteGoalCommand(payload);
    await this.commandBus.execute(command);
    return new MessageResponse(HttpStatus.OK, undefined);
  }

  /**
   * Get all goals. This executes the get goals query.
   * @param payload the payload
   * @returns the goals
   */
  @MessagePattern('getGoals')
  public async getGoals(@Payload() payload: GetGoalsDto): Promise<MessageResponse<Goal[]>> {
    this.logger.log('Received getGoals query');
    const query = new GetGoalsQuery(payload);
    const goals = await this.queryBus.execute<GetGoalsQuery, Goal[] | null>(query);
    return new MessageResponse(HttpStatus.OK, goals);
  }

  /**
   * Get a goal by id. This executes the get goal query. Returns null if no goal is found.
   * @param payload the payload
   * @returns the goal
   */
  @MessagePattern('getGoal')
  public async getGoal(@Payload() payload: GetGoalDto): Promise<MessageResponse<Goal>> {
    this.logger.log(`Received getGoal query: ${JSON.stringify(payload)}`);

    const query = new GetGoalQuery(payload);

    const goal = await this.queryBus.execute<GetGoalQuery, Goal | null>(query);

    if (!goal) {
      return new MessageResponse(HttpStatus.NOT_FOUND, null, 'Goal not found');
    }

    return new MessageResponse(HttpStatus.OK, goal);
  }

  /**
   * Get the activity for a goal. This executes the get goal activity query. Returns null if no goal is found.
   * @param payload the payload
   * @returns the goal activity
   */
  @MessagePattern('getGoalActivity')
  public async getGoalActivity(@Payload() payload: GetGoalActivityDto): Promise<MessageResponse<GoalActivity[]>> {
    this.logger.log(`Received getGoalActivity query: ${JSON.stringify(payload)}`);

    const query = new GetGoalActivityQuery(payload);

    const goalActivity = await this.queryBus.execute<GetGoalActivityQuery, GoalActivity[] | null>(query);

    if (!goalActivity) {
      return new MessageResponse(HttpStatus.NOT_FOUND, null, 'Goal activity not found');
    }

    return new MessageResponse(HttpStatus.OK, goalActivity);
  }
}
