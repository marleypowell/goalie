import { IEvent } from '@nestjs/cqrs';

export class GoalCompletedEvent implements IEvent {
  public readonly eventName = 'GoalCompletedEvent' as const;

  public readonly userId?: string;
}
