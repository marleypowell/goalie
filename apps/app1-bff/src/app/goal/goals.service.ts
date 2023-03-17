import {
  CompleteGoalDto,
  CreateGoalDto,
  GetGoalActivityDto,
  GetGoalDto,
  GetGoalsDto,
  Goal,
  GoalActivity,
  MessageResponse,
} from '@goalie/shared/goals';
import { HttpException, HttpStatus, Inject, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { map, Observable, of, tap } from 'rxjs';

export class GoalsService {
  public constructor(@Inject('NATS_SERVICE') private readonly client: ClientProxy) {}

  public create(createGoalDto: CreateGoalDto): Observable<string> {
    return this.client.send<MessageResponse<string>>('createGoal', createGoalDto).pipe(
      tap((res) => {
        if (res.status !== HttpStatus.CREATED) {
          throw new HttpException(`Error creating goal`, res.status);
        }
      }),
      map((res) => res.data)
    );
  }

  public getAll(userId: string): Observable<Goal[]> {
    return this.client.send<MessageResponse<Goal[]>>('getGoals', new GetGoalsDto(userId)).pipe(
      tap((res) => {
        if (res.status !== HttpStatus.OK) {
          throw new HttpException(`Error getting goals for user ${userId}`, res.status);
        }
      }),
      map((res) => res.data)
    );
  }

  public get(id: string): Observable<Goal> {
    return this.client.send<MessageResponse<Goal>>('getGoal', new GetGoalDto(id)).pipe(
      tap((res) => {
        if (res.status === HttpStatus.NOT_FOUND) {
          throw new NotFoundException(`Goal with id ${id} not found`);
        } else if (res.status !== HttpStatus.OK) {
          throw new HttpException(`Error getting goal with id ${id}`, res.status);
        }
      }),
      map((res) => res.data)
    );
  }

  public getActivity(id: string): Observable<GoalActivity[]> {
    return this.client.send<MessageResponse<GoalActivity[]>>('getGoalActivity', new GetGoalActivityDto(id)).pipe(
      tap((res) => {
        if (res.status === HttpStatus.NOT_FOUND) {
          throw new NotFoundException(`Goal activity with id ${id} not found`);
        } else if (res.status !== HttpStatus.OK) {
          throw new HttpException(`Error getting goal activity with id ${id}`, res.status);
        }
      }),
      map((res) => res.data)
    );
  }

  public complete(id: string): Observable<unknown> {
    return this.client.send<MessageResponse<string>>('completeGoal', new CompleteGoalDto(id)).pipe(
      tap((res) => {
        if (res.status !== HttpStatus.OK) {
          throw new HttpException(`Error completing goal with id ${id}`, res.status);
        }
      }),
      map(() => of())
    );
  }
}
