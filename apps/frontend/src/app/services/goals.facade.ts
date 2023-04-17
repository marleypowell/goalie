import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CheckInGoalDto, Goal, GoalActivity, GoalsService } from '@goalie/shared/api-client-api-gateway';
import { CreateGoalForm } from '@goalie/ui';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';

/**
 * The goals facade.
 */
@Injectable({ providedIn: 'root' })
export class GoalsFacade {
  private readonly goal = new BehaviorSubject<Goal | null>(null);
  public readonly goal$ = this.goal.asObservable();

  private readonly goalActivity = new BehaviorSubject<GoalActivity[] | null>(null);
  public readonly goalActivity$ = this.goalActivity.asObservable();

  public constructor(
    private readonly goalsService: GoalsService,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService
  ) {}

  /**
   * Creates a goal.
   * @param goalId The goal id.
   */
  public loadGoal(goalId: string): void {
    this.getGoal(goalId).subscribe((goal) => {
      this.goal.next(goal);
    });

    this.getGoalActivity(goalId).subscribe((activity) => {
      this.goalActivity.next(activity);
    });
  }

  /**
   * Gets the goals.
   * @returns An observable that emits the goals.
   */
  public getGoals(): Observable<Goal[]> {
    return this.goalsService.getAll().pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === HttpStatusCode.Forbidden) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'You are not authorized to access this. (Admin Only)',
            });
            return [];
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred.' });
            return [];
          }
        }
        return throwError(() => err);
      })
    );
  }

  /**
   * Gets the users goals.
   * @param userId The user id.
   * @returns An observable that emits the goals.
   */
  public getUsersGoals(userId: string): Observable<Goal[]> {
    return this.goalsService.getUsersGoals(userId).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse) {
          if (err instanceof HttpErrorResponse && err.status === HttpStatusCode.Forbidden) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'You are not authorized to access this. (Admin Only)',
            });
            return [];
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred.' });
            return [];
          }
        }
        return throwError(() => err);
      })
    );
  }

  /**
   * Gets a goal.
   * @param goalId The goal id.
   * @returns An observable that emits the goal.
   */
  public getGoal(goalId: string): Observable<Goal> {
    return this.goalsService.get(goalId).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse && err.status === HttpStatusCode.Forbidden) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'You are not authorized to access this. (Admin Only)',
          });
        }

        return throwError(() => err);
      })
    );
  }

  /**
   * Gets the goal activity.
   * @param goalId The goal id.
   * @returns An observable that emits the goal activity.
   */
  public getGoalActivity(goalId: string): Observable<GoalActivity[]> {
    return this.goalsService.getActivity(goalId).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse) {
          if (err instanceof HttpErrorResponse && err.status === HttpStatusCode.Forbidden) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'You are not authorized to access this. (Admin Only)',
            });
            return [];
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred.' });
            return [];
          }
        }
        return throwError(() => err);
      })
    );
  }

  /**
   * Creates a goal.
   * @param form The form data.
   * @returns An observable that emits the goal id.
   */
  public createGoal(form: CreateGoalForm): Observable<string> {
    return this.goalsService
      .create({
        name: form.name,
        target: Number(form.target),
      })
      .pipe(
        tap(() => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Goal created' });
        }),
        catchError((err) => {
          if (err instanceof HttpErrorResponse) {
            if (err instanceof HttpErrorResponse && err.status === HttpStatusCode.Forbidden) {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'You are not authorized to access this. (Admin Only)',
              });
              return [];
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred.' });
              return [];
            }
          }

          return throwError(() => err);
        })
      );
  }

  /**
   * Checks in a goal.
   * @param dto The dto.
   */
  public checkInGoal(dto: CheckInGoalDto): Observable<void> {
    return this.goalsService.checkIn(dto.goalId, dto).pipe(
      tap(() => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Goal checked in' });
      }),
      catchError((err) => {
        if (err instanceof HttpErrorResponse) {
          if (err instanceof HttpErrorResponse && err.status === HttpStatusCode.Forbidden) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'You are not authorized to access this. (Admin Only)',
            });
            return [];
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred.' });
            return [];
          }
        }

        return throwError(() => err);
      })
    );
  }

  /**
   * Completes a goal.
   * @param goalId The goal id.
   * @returns nothing.
   */
  public completeGoal(goalId: string): Observable<void> {
    return this.goalsService.complete(goalId).pipe(
      tap(() => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Goal completed' });
      }),
      catchError((err) => {
        if (err instanceof HttpErrorResponse) {
          if (err instanceof HttpErrorResponse && err.status === HttpStatusCode.Forbidden) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'You are not authorized to access this. (Admin Only)',
            });
            return [];
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred.' });
            return [];
          }
        }

        return throwError(() => err);
      })
    );
  }

  /**
   * Deletes a goal.
   * @param goalId The goal id.
   * @param onDelete The on delete callback.
   */
  public deleteGoal(goalId: string, onDelete: () => void): void {
    this.confirmationService.confirm({
      header: 'Delete Confirmation',
      message: 'Are you sure that you want to delete this goal?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.goalsService
          ._delete(goalId)
          .pipe(
            tap(() => {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Goal deleted' });
            }),
            catchError((err) => {
              if (err instanceof HttpErrorResponse) {
                if (err instanceof HttpErrorResponse && err.status === HttpStatusCode.Forbidden) {
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'You are not authorized to access this. (Admin Only)',
                  });
                  return [];
                } else {
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred.' });
                  return [];
                }
              }

              return throwError(() => err);
            })
          )
          .subscribe(() => {
            onDelete();
          });
      },
    });
  }
}
