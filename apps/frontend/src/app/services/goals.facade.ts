import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Goal, GoalActivity, GoalsService } from '@goalie/shared/api-client-api-gateway';
import { CreateGoalForm } from '@goalie/ui';
import { ConfirmationService, MessageService } from 'primeng/api';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GoalsFacade {
  public constructor(
    private readonly goalsService: GoalsService,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService
  ) {}

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

  public deleteGoal(goalId: string, onDelete: () => void): void {
    this.confirmationService.confirm({
      header: 'Delete Confirmation',
      message: 'Are you sure that you want to delete this goal?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.goalsService
          ._delete(goalId)
          .pipe(
            catchError((err) => {
              if (err instanceof HttpErrorResponse && err.status === HttpStatusCode.Forbidden) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
              }

              return throwError(() => err);
            })
          )
          .subscribe(() => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Goal deleted' });
            onDelete();
          });
      },
    });
  }
}
