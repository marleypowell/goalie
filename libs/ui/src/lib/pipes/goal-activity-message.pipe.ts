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
      case 'GoalCheckedInEvent': {
        const comment = (activity.data as any).comment;
        let message = `made a check-in. Set progress to ${(activity.data as any).progress}.`;

        if (comment) {
          message += ` Comment: ${comment}`;
        }

        return message;
      }
      default:
        return null;
    }
  }
}
