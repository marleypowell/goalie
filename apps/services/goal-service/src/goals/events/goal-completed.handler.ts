import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { GoalCompletedEvent } from './goal-completed.event';

@EventsHandler(GoalCompletedEvent)
export class GoalCompletedHandler implements IEventHandler<GoalCompletedEvent> {
  private readonly logger = new Logger(GoalCompletedHandler.name);

  public handle(event: GoalCompletedEvent) {
    // update your read model here.
    this.logger.log(`updated read model for goal: ${JSON.stringify(event)}`);
  }
}
