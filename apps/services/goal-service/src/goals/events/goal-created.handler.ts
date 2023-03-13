import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { GoalCreatedEvent } from './goal-created.event';

@EventsHandler(GoalCreatedEvent)
export class GoalCreatedHandler implements IEventHandler<GoalCreatedEvent> {
  private readonly logger = new Logger(GoalCreatedHandler.name);

  public handle(event: GoalCreatedEvent) {
    // update your read model here.
    this.logger.log(`updated read model for goal: ${JSON.stringify(event)}`);
  }
}
