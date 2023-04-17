import { GoalCompletedEvent } from '@goalie/shared/goals';
import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

/**
 * The goal completed event handler. This handler is responsible for updating the read model when a goal is completed.
 */
@EventsHandler(GoalCompletedEvent)
export class GoalCompletedHandler implements IEventHandler<GoalCompletedEvent> {
  private readonly logger = new Logger(GoalCompletedHandler.name);

  public handle(event: GoalCompletedEvent) {
    // update your read model here.
    this.logger.log(`updated read model for goal: ${JSON.stringify(event)}`);
  }
}
