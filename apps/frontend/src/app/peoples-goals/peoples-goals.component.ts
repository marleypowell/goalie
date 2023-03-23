import { CommonModule } from '@angular/common';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Goal, GoalsService } from '@goalie/shared/api-client-api-gateway';
import { GoalsTableComponent } from '@goalie/ui';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, catchError, throwError } from 'rxjs';

@Component({
  selector: 'goalie-peoples-goals',
  standalone: true,
  imports: [CommonModule, GoalsTableComponent],
  templateUrl: './peoples-goals.component.html',
  styleUrls: ['./peoples-goals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeoplesGoalsComponent implements OnInit {
  public readonly goals$ = new BehaviorSubject<Goal[]>([]);

  public constructor(
    private readonly router: Router,
    private readonly goalsService: GoalsService,
    private readonly messageService: MessageService
  ) {}

  public ngOnInit(): void {
    this.loadGoals();
  }

  public deleteGoal(goalId: string): void {
    this.goalsService._delete(goalId).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Goal deleted' });
      this.loadGoals();
    });
  }

  public navigateToGoal(goalId: string): void {
    this.router.navigate(['goals', goalId]);
  }

  private loadGoals(): void {
    this.goalsService
      .getAll()
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
