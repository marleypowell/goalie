import { GoalCreatedEvent } from '@goalie/shared/goals';
import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

/**
 * The goal created event handler. This handler is responsible for updating the read model when a goal is created.
 */
@EventsHandler(GoalCreatedEvent)
export class GoalCreatedHandler implements IEventHandler<GoalCreatedEvent> {
  private readonly logger = new Logger(GoalCreatedHandler.name);

  public handle(event: GoalCreatedEvent) {
    // update your read model here.
    this.logger.log(`updated read model for goal: ${JSON.stringify(event)}`);
  }
}
