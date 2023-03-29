import { Pipe, PipeTransform } from '@angular/core';
import { Goal } from '@goalie/shared/api-client-api-gateway';

@Pipe({
  name: 'goalProgress',
  standalone: true,
})
export class GoalProgressPipe implements PipeTransform {
  public transform(goal: Goal | undefined): number {
    if (!goal || !goal.target) {
      return 0;
    }

    return Math.round((goal.progress / goal.target) * 100);
  }
}
