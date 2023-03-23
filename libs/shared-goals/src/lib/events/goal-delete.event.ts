import { IEvent } from '@nestjs/cqrs';

export class GoalDeletedEvent implements IEvent {
  public readonly eventName = 'GoalDeletedEvent' as const;

  public readonly userId?: string;
}
