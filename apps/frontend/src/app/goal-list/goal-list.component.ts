import { CommonModule } from '@angular/common';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Goal, GoalsService } from '@goalie/shared/api-client-api-gateway';
import { CreateGoalForm, UserGoalsComponent } from '@goalie/ui';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { BehaviorSubject, catchError, throwError } from 'rxjs';
@Component({
  selector: 'goalie-goal-list',
  standalone: true,
  imports: [CommonModule, UserGoalsComponent, ToastModule],
  templateUrl: './goal-list.component.html',
  styleUrls: ['./goal-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoalListComponent implements OnInit {
  public readonly goals$ = new BehaviorSubject<Goal[]>([]);

  public constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly goalsService: GoalsService,
    private readonly messageService: MessageService
  ) {}

  public ngOnInit(): void {
    this.loadGoals();
  }

  public createGoal(form: CreateGoalForm): void {
    this.goalsService
      .create({
        name: form.name,
        target: Number(form.target),
      })
      .subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Goal created' });
        this.loadGoals();
      });
  }

  public navigateToGoal(goalId: string): void {
    this.router.navigate([goalId], { relativeTo: this.route });
  }

  private loadGoals(): void {
    this.goalsService
      .getUsersGoals('me')
      .pipe(
        catchError((err) => {
          if (err instanceof HttpErrorResponse && err.status === HttpStatusCode.Forbidden) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
            return [];
          }

          return throwError(() => err);
        })
      )
      .subscribe((goals: Goal[]) => {
        this.goals$.next(goals);
      });
  }
}
