import { subject } from '@casl/ability';
import { CaslAbility, UseCasl, UseDtoUserId } from '@goalie/nest-auth';
import { CheckInGoalDto, CreateGoalDto, Goal, GoalActivity } from '@goalie/shared/goals';
import { Body, Controller, ForbiddenException, Get, HttpStatus, Logger, Param, Post } from '@nestjs/common';
import { ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { map, mergeMap, Observable } from 'rxjs';
import { AppAbility } from '../auth/casl/casl.factory';
import { ReqUser } from '../auth/request-user.decorator';
import { User } from '../auth/user.model';
import { GoalsService } from './goals.service';

@UseCasl()
@ApiTags('goals')
@Controller('goals')
export class GoalsController {
  private readonly logger = new Logger(GoalsController.name);

  public constructor(private readonly service: GoalsService) {}

  /**
   * Create a new goal.
   * @param createGoalDto the goal to create.
   * @returns nothing.
   */
  @Post()
  @UseDtoUserId()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The goal has been successfully created.',
    type: String,
  })
  @ApiProduces('text/plain')
  public create(@CaslAbility() ability: AppAbility, @Body() createGoalDto: CreateGoalDto): Observable<string> {
    if (ability.cannot('create', 'Goal')) {
      throw new ForbiddenException(`You are not allowed to create a goal.`);
    }

    return this.service.create(createGoalDto);
  }

  /**
   * Get all goals for a user.
   * @param user the user.
   * @returns the list of goals.
   */
  @Get('list')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The list of goals has been successfully retrieved.',
    type: [Goal],
  })
  public getAll(@CaslAbility() ability: AppAbility): Observable<Goal[]> {
    this.logger.debug(`Getting all goals`);

    if (ability.cannot('manage', 'Goal')) {
      throw new ForbiddenException(`You are not allowed to access some of the goals.`);
    }

    return this.service.getAll();
  }

  @Get('users/:userId/goals/list')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The list of goals has been successfully retrieved.',
    type: [Goal],
  })
  public getUsersGoals(
    @CaslAbility() ability: AppAbility,
    @ReqUser() user: User,
    @Param('userId') userId: string
  ): Observable<Goal[]> {
    this.logger.debug(`Getting goals for user ${user.userId}`);

    const usrId = userId === 'me' ? user.userId : userId;

    if (usrId !== user.userId && ability.cannot('read', 'Goal')) {
      throw new ForbiddenException(`You are not allowed to access some of the goals.`);
    }

    return this.service.getAll(usrId).pipe(
      map((goals) => {
        if (goals.some((goal) => ability.cannot('read', subject('Goal', goal)))) {
          throw new ForbiddenException(`You are not allowed to access some of the goals.`);
        }

        return goals;
      })
    );
  }

  /**
   * Get a goal for a user.
   * @param user the user.
   * @param id the goal id.
   * @returns the goal.
   */
  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The goal has been successfully retrieved.',
    type: Goal,
  })
  public get(@CaslAbility() ability: AppAbility, @Param('id') id: string): Observable<Goal> {
    return this.service.get(id).pipe(
      map((goal) => {
        if (ability.cannot('read', subject('Goal', goal))) {
          throw new ForbiddenException(`You are not allowed to access this goal.`);
        }

        return goal;
      })
    );
  }

  /**
   * Get a goal activity for a user.
   * @param user the user.
   * @param id the goal id.
   * @returns the goal activity.
   */
  @Get(':id/activity')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The goal activity has been successfully retrieved.',
    type: [GoalActivity],
  })
  public getActivity(@CaslAbility() ability: AppAbility, @Param('id') id: string): Observable<GoalActivity[]> {
    return this.service.get(id).pipe(
      mergeMap((goal) => {
        if (ability.cannot('read', subject('Goal', goal))) {
          throw new ForbiddenException(`You are not allowed to access this goal.`);
        }

        return this.service.getActivity(id);
      })
    );
  }

  /**
   * Check-in a goal for a user.
   * @param user the user.
   * @param id the goal id.
   * @param checkInGoalDto the check-in data.
   * @returns nothing.
   */
  @Post(':id/check-in')
  @UseDtoUserId()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The goal has been successfully checked in.',
  })
  public checkIn(
    @CaslAbility() ability: AppAbility,
    @Param('id') id: string,
    @Body() checkInGoalDto: CheckInGoalDto
  ): Observable<unknown> {
    return this.service.get(id).pipe(
      mergeMap((goal) => {
        if (ability.cannot('update', subject('Goal', goal))) {
          throw new ForbiddenException(`You are not allowed to check in this goal.`);
        }

        return this.service.checkIn(checkInGoalDto);
      })
    );
  }

  /**
   * Complete a goal for a user.
   * @param user the user.
   * @param id the goal id.
   * @returns nothing.
   */
  @Post(':id/complete')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The goal has been successfully completed.',
  })
  public complete(@CaslAbility() ability: AppAbility, @Param('id') id: string): Observable<unknown> {
    return this.service.get(id).pipe(
      mergeMap((goal) => {
        if (ability.cannot('update', subject('Goal', goal))) {
          throw new ForbiddenException(`You are not allowed to complete this goal.`);
        }

        return this.service.complete(id);
      })
    );
  }

  /**
   * Delete a goal for a user.
   * @param user the user.
   * @param id the goal id.
   * @returns nothing.
   */
  @Post(':id/delete')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The goal has been successfully deleted.',
  })
  public delete(@CaslAbility() ability: AppAbility, @Param('id') id: string): Observable<unknown> {
    return this.service.get(id).pipe(
      mergeMap((goal) => {
        if (ability.cannot('delete', subject('Goal', goal))) {
          throw new ForbiddenException(`You are not allowed to delete this goal.`);
        }

        return this.service.delete(id);
      })
    );
  }
}
