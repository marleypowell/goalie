import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Goal, GoalActivity, GoalsService } from '@goalie/shared/api-client-api-gateway';
import { CreateGoalForm } from '@goalie/ui';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';

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

  public loadGoal(goalId: string): void {
    this.getGoal(goalId).subscribe((goal) => {
      this.goal.next(goal);
    });

    this.getGoalActivity(goalId).subscribe((activity) => {
      this.goalActivity.next(activity);
    });
  }

  public getGoals(): Observable<Goal[]> {
    return this.goalsService.getAll().pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse && err.status === HttpStatusCode.Forbidden) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
          return [];
        }

        return throwError(() => err);
      })
    );
  }

  public getUsersGoals(userId: string): Observable<Goal[]> {
    return this.goalsService.getUsersGoals(userId).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse && err.status === HttpStatusCode.Forbidden) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
          return [];
        }

        return throwError(() => err);
      })
    );
  }

  public getGoal(goalId: string): Observable<Goal> {
    return this.goalsService.get(goalId).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse && err.status === HttpStatusCode.Forbidden) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
        }

        return throwError(() => err);
      })
    );
  }

  public getGoalActivity(goalId: string): Observable<GoalActivity[]> {
    return this.goalsService.getActivity(goalId).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse && err.status === HttpStatusCode.Forbidden) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
          return [];
        }

        return throwError(() => err);
      })
    );
  }

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
          if (err instanceof HttpErrorResponse && err.status === HttpStatusCode.Forbidden) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
          }

          return throwError(() => err);
        })
      );
  }

  public completeGoal(goalId: string): Observable<void> {
    return this.goalsService.complete(goalId).pipe(
      tap(() => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Goal completed' });
      }),
      catchError((err) => {
        if (err instanceof HttpErrorResponse && err.status === HttpStatusCode.Forbidden) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
        }

        return throwError(() => err);
      })
    );
  }

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
              if (err instanceof HttpErrorResponse && err.status === HttpStatusCode.Forbidden) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
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
