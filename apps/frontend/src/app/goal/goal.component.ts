import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GoalDetailsComponent } from '@goalie/ui';
import { iif, map, mergeMap, of, shareReplay } from 'rxjs';
import { GoalsFacade } from '../services/goals.facade';

@Component({
  selector: 'goalie-goal',
  standalone: true,
  imports: [CommonModule, GoalDetailsComponent],
  templateUrl: './goal.component.html',
  styleUrls: ['./goal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoalComponent {
  public readonly goalId$ = this.route.paramMap.pipe(
    map((params) => params.get('id')),
    shareReplay()
  );

  public readonly goal$ = this.goalId$.pipe(
    mergeMap((id) => iif(() => !!id, this.goalsFacade.getGoal(String(id)), of(null)))
  );

  public readonly goalActivity$ = this.goalId$.pipe(
    mergeMap((id) => iif(() => !!id, this.goalsFacade.getGoalActivity(String(id)), of(null)))
  );

  public constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly goalsFacade: GoalsFacade
  ) {}

  public deleteGoal(goalId: string): void {
    this.goalsFacade.deleteGoal(goalId, () => {
      this.router.navigate(['/goals']);
    });
  }
}
