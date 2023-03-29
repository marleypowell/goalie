import { MessageResponse } from '@goalie/common';
import {
  CheckInGoalDto,
  CompleteGoalDto,
  CreateGoalDto,
  DeleteGoalDto,
  GetGoalActivityDto,
  GetGoalDto,
  GetGoalsDto,
  Goal,
  GoalActivity,
} from '@goalie/shared/goals';
import { HttpException, HttpStatus, Inject, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { combineLatest, map, mergeMap, Observable, of, tap } from 'rxjs';

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

  public getAll(userId?: string): Observable<Goal[]> {
    return this.client.send<MessageResponse<Goal[]>>('getGoals', new GetGoalsDto(userId)).pipe(
      tap((res) => {
        if (res.status !== HttpStatus.OK) {
          throw new HttpException(`Error getting goals for user ${userId}`, res.status);
        }
      }),
      mergeMap((res) => {
        const goals = res.data;

        if (!goals || goals.length === 0) {
          return of([]);
        }

        const userIds = Array.from(new Set(goals.map((goal) => goal.userId)));
        return combineLatest(userIds.map((userId) => this.client.send('getUser', { userId }))).pipe(
          map((users) => {
            return goals.map((goal) => {
              const res = users.find((user) => user?.data?.id === goal.userId);
              return { ...goal, user: res?.data } as Goal;
            });
          })
        );
      })
    );
  }

  public get(id: string): Observable<Goal | null> {
    return this.client.send<MessageResponse<Goal>>('getGoal', new GetGoalDto(id)).pipe(
      tap((res) => {
        if (res.status === HttpStatus.NOT_FOUND) {
          throw new NotFoundException(`Goal with id ${id} not found`);
        } else if (res.status !== HttpStatus.OK) {
          throw new HttpException(`Error getting goal with id ${id}`, res.status);
        }
      }),
      mergeMap((res) => {
        if (!res.data) {
          return of(null);
        }

        return this.client.send('getUser', { userId: res.data.userId }).pipe(
          map((user) => {
            return {
              ...res.data,
              user: user.data,
            } as Goal;
          })
        );
      })
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
      mergeMap((res) => {
        const activity = res.data;

        if (!activity || activity.length === 0) {
          return of([]);
        }

        const userIds = Array.from(new Set(activity.map((a) => a.data?.userId)));
        return combineLatest(userIds.map((userId) => this.client.send('getUser', { userId }))).pipe(
          map((users) => {
            return activity.map((a) => {
              const res = users.find((user) => user.data.id === a.data.userId);
              return {
                ...a,
                data: {
                  ...a.data,
                  user: res.data,
                } as unknown,
              } as GoalActivity;
            });
          })
        );
      })
    );
  }

  public checkIn(checkInGoalDto: CheckInGoalDto): Observable<unknown> {
    return this.client.send<MessageResponse<string>>('checkInGoal', checkInGoalDto).pipe(
      tap((res) => {
        if (res.status !== HttpStatus.OK) {
          throw new HttpException(`Error checking in goal with id ${checkInGoalDto.goalId}`, res.status);
        }
      }),
      map(() => of())
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

  public delete(id: string): Observable<unknown> {
    return this.client.send<MessageResponse<undefined>>('deleteGoal', new DeleteGoalDto(id)).pipe(
      tap((res) => {
        if (res.status !== HttpStatus.OK) {
          throw new HttpException(`Error deleting goal with id ${id}`, res.status);
        }
      }),
      map(() => of())
    );
  }
}
