import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GoalDetailsComponent } from '@goalie/ui';
import { map } from 'rxjs';
import { GoalsFacade } from '../services/goals.facade';

@Component({
  selector: 'goalie-goal',
  standalone: true,
  imports: [CommonModule, GoalDetailsComponent],
  templateUrl: './goal.component.html',
  styleUrls: ['./goal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoalComponent implements OnInit {
  public readonly goal$ = this.goalsFacade.goal$;

  public readonly goalActivity$ = this.goalsFacade.goalActivity$;

  public constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly goalsFacade: GoalsFacade
  ) {}

  public ngOnInit(): void {
    this.route.paramMap.pipe(map((params) => params.get('id'))).subscribe((goalId) => {
      if (goalId) {
        this.goalsFacade.loadGoal(goalId);
      }
    });
  }

  public completeGoal(goalId: string): void {
    this.goalsFacade.completeGoal(goalId).subscribe(() => {
      this.goalsFacade.loadGoal(goalId);
    });
  }

  public deleteGoal(goalId: string): void {
    this.goalsFacade.deleteGoal(goalId, () => {
      this.router.navigate(['/goals']);
    });
  }
}
