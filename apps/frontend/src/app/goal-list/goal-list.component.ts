import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Goal, GoalsService } from '@goalie/shared/api-client-api-gateway';
import { CreateGoalForm, CreateGoalFormComponent } from '@goalie/ui';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { BehaviorSubject, mergeMap, take } from 'rxjs';

@Component({
  selector: 'goalie-goal-list',
  standalone: true,
  imports: [CommonModule, ButtonModule, TableModule, ToolbarModule, DynamicDialogModule, ConfirmDialogModule],
  providers: [DialogService, ConfirmationService],
  templateUrl: './goal-list.component.html',
  styleUrls: ['./goal-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoalListComponent implements OnInit {
  public selectedGoals: Goal[] = [];

  public readonly columns = [
    {
      columnDef: 'goalId',
      header: 'Id',
      cell: (goal: Goal) => `${goal.goalId}`,
    },
    {
      columnDef: 'userId',
      header: 'User',
      cell: (goal: Goal) => `${goal.userId}`,
    },
    {
      columnDef: 'name',
      header: 'Name',
      cell: (goal: Goal) => `${goal.name}`,
    },
    {
      columnDef: 'target',
      header: 'Target',
      cell: (goal: Goal) => `${goal.target}`,
    },
    {
      columnDef: 'goalCompleted',
      header: 'Goal Completed',
      cell: (goal: Goal) => `${goal.goalCompleted}`,
    },
  ];

  public readonly displayedColumns = [...this.columns.map((c) => c.columnDef), 'action'];

  public readonly goals$ = new BehaviorSubject<Goal[]>([]);

  public constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly goalsService: GoalsService,
    private readonly dialogService: DialogService,
    private readonly confirmationService: ConfirmationService
  ) {}

  public ngOnInit(): void {
    this.loadGoals();
  }

  public createGoal(): void {
    const dialogRef = this.dialogService.open(CreateGoalFormComponent, {
      header: 'New goal',
      width: '70%',
    });

    dialogRef.onClose
      .pipe(
        take(1),
        mergeMap((form: CreateGoalForm) =>
          this.goalsService.create({
            name: form.name,
            target: Number(form.target),
          })
        )
      )
      .subscribe(() => {
        this.loadGoals();
      });
  }

  public completeGoal(event: Event, goalId: string): void {
    event.stopPropagation();
    this.goalsService.complete(goalId).subscribe(() => {
      this.loadGoals();
    });
  }

  public deleteGoal(event: Event, goalId: string): void {
    event.stopPropagation();

    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this goal?',
      accept: () => {
        this.goalsService._delete(goalId).subscribe(() => {
          this.loadGoals();
        });
      },
    });
  }

  public navigateToGoal(goalId: string): void {
    this.router.navigate([goalId], { relativeTo: this.route });
  }

  public itemSelected(event: Event): void {
    event.stopPropagation();
  }

  private loadGoals(): void {
    this.goalsService.getAll().subscribe((goals: Goal[]) => {
      this.goals$.next(goals);
    });
  }
}
