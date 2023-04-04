import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Goal } from '@goalie/shared/api-client-api-gateway';
import { CreateGoalForm, UserGoalsComponent } from '@goalie/ui';
import { ToastModule } from 'primeng/toast';
import { BehaviorSubject } from 'rxjs';
import { GoalsFacade } from '../services/goals.facade';

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
    private readonly goalsFacade: GoalsFacade
  ) {}

  public ngOnInit(): void {
    this.loadGoals();
  }

  public createGoal(form: CreateGoalForm): void {
    this.goalsFacade.createGoal(form).subscribe(() => {
      this.loadGoals();
    });
  }

  public navigateToGoal(goalId: string): void {
    this.router.navigate([goalId], { relativeTo: this.route });
  }

  private loadGoals(): void {
    this.goalsFacade.getUsersGoals('me').subscribe((goals: Goal[]) => {
      this.goals$.next(goals);
    });
  }
}
