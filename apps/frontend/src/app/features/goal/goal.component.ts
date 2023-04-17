import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CheckInGoalDto } from '@goalie/shared/api-client-api-gateway';
import { GoalDetailsComponent } from '@goalie/ui';
import { map } from 'rxjs';
import { GoalsFacade } from '../../services/goals.facade';

/**
 * The goal component. Displays the goal details.
 */
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

  /**
   * Initializes the component. Gets the goal id from the route and loads the goal.
   */
  public ngOnInit(): void {
    this.route.paramMap.pipe(map((params) => params.get('id'))).subscribe((goalId) => {
      if (goalId) {
        this.goalsFacade.loadGoal(goalId);
      }
    });
  }

  /**
   * Completes the goal then loads the goal.
   * @param goalId The goal id.
   */
  public completeGoal(goalId: string): void {
    this.goalsFacade.completeGoal(goalId).subscribe(() => {
      this.goalsFacade.loadGoal(goalId);
    });
  }

  /**
   * Checks in the goal then loads the goal.
   * @param dto The check in goal dto.
   */
  public checkInGoal(dto: CheckInGoalDto): void {
    this.goalsFacade.checkInGoal(dto).subscribe(() => {
      this.goalsFacade.loadGoal(dto.goalId);
    });
  }

  /**
   * Deletes the goal then navigates to the goals page.
   * @param goalId The goal id.
   */
  public deleteGoal(goalId: string): void {
    this.goalsFacade.deleteGoal(goalId, () => {
      this.router.navigate(['/goals']);
    });
  }
}
