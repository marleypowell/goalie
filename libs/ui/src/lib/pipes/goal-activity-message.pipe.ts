import { Pipe, PipeTransform } from '@angular/core';
import { GoalActivity } from '@goalie/shared/api-client-api-gateway';

@Pipe({
  name: 'goalActivityMessage',
  standalone: true,
})
export class GoalActivityMessagePipe implements PipeTransform {
  public transform(activity: GoalActivity | undefined): string | null {
    if (!activity) {
      return null;
    }

    switch (activity.type as unknown as string) {
      case 'GoalCreatedEvent':
        return `created this Goal`;
      case 'GoalCompletedEvent':
        return `completed this Goal`;
      case 'GoalDeletedEvent':
        return `deleted this Goal`;
      case 'GoalCheckedInEvent':
        return `made a check-in. Set progress to ${(activity.data as any).progress}`;
      default:
        return null;
    }
  }
}
