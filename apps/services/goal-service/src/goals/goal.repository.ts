import { FORWARDS, jsonEvent, START, StreamNotFoundError } from '@eventstore/db-client';
import { Injectable, Logger } from '@nestjs/common';
import { eventStore } from '../common/event-store';
import { GoalJsonEvent } from './events';
import { GoalAggregate } from './models/goal.model';

@Injectable()
export class GoalRepository {
  private readonly logger = new Logger(GoalRepository.name);

  public async save(aggregate: GoalAggregate) {
    this.logger.log(`saving aggregate: ${JSON.stringify(aggregate)}`);

    const events = aggregate.getUncommittedEvents();

    for (const event of events) {
      const { eventName, ...data } = event;
      this.logger.log(`saving event: ${eventName} ${JSON.stringify(data)}`);

      await eventStore.appendToStream(
        aggregate.getId(),
        jsonEvent({
          type: eventName,
          data: data ?? {},
        })
      );
    }

    aggregate.commit();
  }

  public async getById(goalId: string): Promise<GoalAggregate> {
    this.logger.log(`getting aggregate by id: ${goalId}`);

    const events = await this.getEvents(goalId);

    const aggregate = new GoalAggregate();
    aggregate.loadFromHistory(events);

    return aggregate;
  }

  private async getEvents(aggregateId: string): Promise<Array<GoalJsonEvent['data']>> {
    const eventStream = eventStore.readStream<GoalJsonEvent>(aggregateId, {
      direction: FORWARDS,
      fromRevision: START,
      maxCount: 1000,
    });

    const events: Array<GoalJsonEvent['data']> = [];

    try {
      for await (const resolvedEvent of eventStream) {
        const data = { ...resolvedEvent.event.data, constructor: { name: resolvedEvent.event.type } };
        events.push(Object.assign(Object.create(data), data));
      }

      return events;
    } catch (error) {
      if (error instanceof StreamNotFoundError) {
        return null;
      }

      throw error;
    }
  }
}
