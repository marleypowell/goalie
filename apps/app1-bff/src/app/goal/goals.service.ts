import {
  CompleteGoalDto,
  CreateGoalDto,
  GetGoalActivityDto,
  GetGoalDto,
  GetGoalsDto,
  Goal,
  GoalActivity,
} from '@goalie/shared/goals';
import { Inject, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { map, Observable } from 'rxjs';

export class GoalsService {
  public constructor(@Inject('GOALS_SERVICE') private readonly client: ClientProxy) {}

  public create(createGoalDto: CreateGoalDto): Observable<unknown> {
    return this.client.send('createGoal', createGoalDto);
  }

  public findAll(userId: string): Observable<Goal[]> {
    return this.client.send('getGoals', new GetGoalsDto(userId)).pipe(
      map((res) => {
        if (!res.data?.length) {
          throw new NotFoundException('No goals found');
        }

        return res.data;
      })
    );
  }

  public findOne(userId: string, id: string): Observable<Goal> {
    return this.client.send('getGoal', new GetGoalDto(userId, id)).pipe(
      map((res) => {
        if (!res.data) {
          throw new NotFoundException(`Goal with id ${id} not found`);
        }

        return res.data;
      })
    );
  }

  public findOneActivity(userId: string, id: string): Observable<GoalActivity[]> {
    return this.client.send('getGoalActivity', new GetGoalActivityDto(userId, id)).pipe(
      map((res) => {
        if (!res.data?.length) {
          throw new NotFoundException(`Goal activity with id ${id} not found`);
        }

        return res.data;
      })
    );
  }

  public complete(userId: string, id: string): Observable<unknown> {
    return this.client.send('completeGoal', new CompleteGoalDto(userId, id));
  }
}
