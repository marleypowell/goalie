import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Goal } from '@goalie/shared/api-client-api-gateway';
import { GoalsTableComponent } from '@goalie/ui';
import { BehaviorSubject } from 'rxjs';
import { GoalsFacade } from '../services/goals.facade';

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

  public constructor(private readonly router: Router, private readonly goalsFacade: GoalsFacade) {}

  public ngOnInit(): void {
    this.loadGoals();
  }

  public deleteGoal(goalId: string): void {
    this.goalsFacade.deleteGoal(goalId, () => {
      this.loadGoals();
    });
  }

  public navigateToGoal(goalId: string): void {
    this.router.navigate(['goals', goalId]);
  }

  private loadGoals(): void {
    this.goalsFacade.getGoals().subscribe((goals: Goal[]) => {
      this.goals$.next(goals);
    });
  }
}
