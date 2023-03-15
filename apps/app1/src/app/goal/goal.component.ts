import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Goal, GoalActivity } from '@goalie/shared/api-client-api-gateway';
import { CardModule } from 'primeng/card';
import { TimelineModule } from 'primeng/timeline';
import { iif, map, mergeMap, Observable, of, shareReplay } from 'rxjs';

@Component({
  selector: 'goalie-goal',
  standalone: true,
  imports: [CommonModule, TimelineModule, CardModule],
  templateUrl: './goal.component.html',
  styleUrls: ['./goal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoalComponent {
  public readonly goalId$ = this.route.paramMap.pipe(
    map((params) => params.get('id')),
    shareReplay()
  );

  public readonly goal$ = this.goalId$.pipe(mergeMap((id) => iif(() => !!id, this.getGoal(String(id)), of(null))));

  public readonly goalActivity$ = this.goalId$.pipe(
    mergeMap((id) => iif(() => !!id, this.getGoalActivity(String(id)), of(null)))
  );

  public constructor(private readonly route: ActivatedRoute, private readonly http: HttpClient) {}

  private getGoal(goalId: string): Observable<Goal> {
    return this.http.get<Goal>(`/api/goals/${goalId}`);
  }

  private getGoalActivity(goalId: string): Observable<GoalActivity[]> {
    return this.http.get<GoalActivity[]>(`/api/goals/${goalId}/activity`);
  }
}
