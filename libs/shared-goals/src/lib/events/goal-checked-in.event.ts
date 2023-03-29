import { IEvent } from '@nestjs/cqrs';
import { CheckInGoalCommand } from '../commands';

export class GoalCheckedInEvent implements IEvent {
  public readonly eventName = 'GoalCheckedInEvent' as const;

  public readonly userId: string;

  public readonly progress: number;

  public constructor(command: CheckInGoalCommand) {
    this.userId = command.userId;
    this.progress = command.progress;
  }
}
