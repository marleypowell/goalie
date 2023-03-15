import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Goal, GoalsService } from '@goalie/shared/api-client-api-gateway';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'goalie-goal-list',
  standalone: true,
  imports: [CommonModule, ButtonModule, TableModule, ToolbarModule],
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
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly goalsService: GoalsService
  ) {}

  public ngOnInit(): void {
    this.loadGoals();
  }

  public createGoal(): void {
    const goals = this.goals$.getValue();
    const name = `My goal ${goals.length + 1}`;

    this.goalsService.create({ name, target: 100 }).subscribe(() => {
      this.loadGoals();
    });
  }

  public completeGoal(event: Event, goalId: string): void {
    event.stopPropagation();
    this.http.post(`/api/goals/${goalId}/complete`, null, { withCredentials: true }).subscribe(() => {
      this.loadGoals();
    });
  }

  public navigateToGoal(goalId: string): void {
    this.router.navigate([goalId], { relativeTo: this.route });
  }

  public itemSelected(event: Event): void {
    event.stopPropagation();
  }

  private loadGoals(): void {
    this.goalsService.getAll().subscribe((res: Goal[]) => {
      this.goals$.next(res.filter((goal) => !!goal.goalId));
      console.log(res);
    });
  }
}
