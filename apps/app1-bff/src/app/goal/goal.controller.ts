import { CreateGoalDto, Goal, GoalActivity } from '@goalie/shared/goals';
import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { UseDtoUserId } from '../auth/dto-user-id.interceptor';
import { ReqUser } from '../auth/request-user.decorator';
import { User } from '../auth/user.model';
import { GoalsService } from './goals.service';

@ApiTags('goals')
@Controller('goals')
export class GoalController {
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
  public create(@Body() createGoalDto: CreateGoalDto): Observable<string> {
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
  public getAll(@ReqUser() user: User): Observable<Goal[]> {
    return this.service.getAll(user.userId);
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
  public get(@ReqUser() _user: User, @Param('id') id: string): Observable<Goal> {
    return this.service.get(id);
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
  public getActivity(@ReqUser() _user: User, @Param('id') id: string): Observable<GoalActivity[]> {
    return this.service.getActivity(id);
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
  public complete(@ReqUser() _user: User, @Param('id') id: string): Observable<unknown> {
    return this.service.complete(id);
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
  public delete(@ReqUser() _user: User, @Param('id') id: string): Observable<unknown> {
    return this.service.delete(id);
  }
}
