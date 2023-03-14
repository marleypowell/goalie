import {
  CompleteGoalDto,
  CreateGoalDto,
  GetGoalActivityDto,
  GetGoalDto,
  GetGoalsDto,
  Goal,
  GoalActivity,
} from '@goalie/shared/goals';
import { Body, Controller, Get, Inject, NotFoundException, Param, Post, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { map, Observable } from 'rxjs';
import { ApiRequest } from '../common/api-request';

@Controller('goals')
export class GoalController {
  public constructor(@Inject('GOALS_SERVICE') private readonly client: ClientProxy) {}

  @Post()
  public create(@Req() req: ApiRequest, @Body() createGoalDto: CreateGoalDto): Observable<unknown> {
    return this.client.send('createGoal', createGoalDto.withUserId(req.user.userId));
  }

  @Get('list')
  public findAll(@Req() req: ApiRequest): Observable<Goal[]> {
    return this.client.send('getGoals', new GetGoalsDto(req.user.userId)).pipe(
      map((res) => {
        if (!res.data?.length) {
          throw new NotFoundException('No goals found');
        }

        return res.data;
      })
    );
  }

  @Get(':id')
  public findOne(@Req() req: ApiRequest, @Param('id') id: string): Observable<Goal> {
    return this.client.send('getGoal', new GetGoalDto(req.user.userId, id)).pipe(
      map((res) => {
        if (!res.data) {
          throw new NotFoundException(`Goal with id ${id} not found`);
        }

        return res.data;
      })
    );
  }

  @Get(':id/activity')
  public findOneActivity(@Req() req: ApiRequest, @Param('id') id: string): Observable<GoalActivity[]> {
    return this.client.send('getGoalActivity', new GetGoalActivityDto(req.user.userId, id)).pipe(
      map((res) => {
        if (!res.data?.length) {
          throw new NotFoundException(`Goal activity with id ${id} not found`);
        }

        return res.data;
      })
    );
  }

  @Post(':id/complete')
  public complete(@Req() req: ApiRequest, @Param('id') id: string): Observable<unknown> {
    return this.client.send('completeGoal', new CompleteGoalDto(req.user.userId, id));
  }
}
