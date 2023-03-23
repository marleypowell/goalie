import { BACKWARDS, END, FORWARDS, jsonEvent, START, StreamNotFoundError } from '@eventstore/db-client';
import { Goal, GoalActivity, GoalJsonEvent, GoalRecordedEvent } from '@goalie/shared/goals';
import { Injectable, Logger } from '@nestjs/common';
import { EventStoreService } from '../common/event-store.service';
import { goalReducer } from './entities/goal.reducer';
import { GoalAggregate } from './models/goal.model';

@Injectable()
export class GoalsRepository {
  private readonly logger = new Logger(GoalsRepository.name);

  public constructor(private readonly eventStore: EventStoreService) {}

  public async save(aggregate: GoalAggregate) {
    this.logger.log(`saving aggregate: ${JSON.stringify(aggregate)}`);

    const events = aggregate.getUncommittedEvents();

    for (const event of events) {
      const { eventName, ...data } = event;
      this.logger.log(`saving event: ${eventName} ${JSON.stringify(data)}`);

      await this.eventStore.getClient().appendToStream(
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

  public async findAll(): Promise<Goal[] | null> {
    const goals: Goal[] = [];

    const events = this.eventStore.getClient().readAll({
      direction: FORWARDS,
      fromPosition: START,
      maxCount: 1000,
    });

    try {
      for await (const resolvedEvent of events) {
        // system events can be ignored - https://developers.eventstore.com/clients/grpc/reading-events.html#handling-system-events
        if (resolvedEvent.event?.type.startsWith('$')) {
          continue;
        }

        const event = resolvedEvent.event;
        const data: any = event.data;

        switch (event?.type) {
          case 'GoalCreatedEvent': {
            goals.push({
              goalId: data.goalId,
              userId: data.userId,
              name: data.name,
              target: data.target,
              goalCompleted: false,
              goalDeleted: false,
              createdAt: event.created.toISOString(),
            });
            break;
          }
          case 'GoalCompletedEvent': {
            const goal = goals.find((g) => g.goalId == resolvedEvent.event.streamId);
            if (goal) {
              goal.goalCompleted = true;
              goal.completedAt = event.created.toISOString();
            }
            break;
          }
          case 'GoalDeletedEvent': {
            const goal = goals.find((g) => g.goalId == resolvedEvent.event.streamId);
            if (goal) {
              goal.goalDeleted = true;
              goal.deletedAt = event.created.toISOString();
            }
            break;
          }
        }
      }

      return goals;
    } catch (error) {
      if (error instanceof StreamNotFoundError) {
        return null;
      }

      throw error;
    }
  }

  public async findOne(goalId: string): Promise<Goal | null> {
    let goal: Goal = {
      goalId: '',
      userId: '',
      name: '',
      target: 0,
      goalCompleted: false,
      goalDeleted: false,
      createdAt: '',
    };

    const events = this.eventStore.getClient().readStream<GoalRecordedEvent>(goalId, {
      direction: FORWARDS,
      fromRevision: START,
      maxCount: 1000,
    });

    try {
      for await (const resolvedEvent of events) {
        goal = goalReducer(goal, resolvedEvent.event);
      }

      return goal;
    } catch (error) {
      if (error instanceof StreamNotFoundError) {
        return null;
      }

      throw error;
    }
  }

  public async getGoalActivity(goalId: string): Promise<GoalActivity[] | null> {
    const events = this.eventStore.getClient().readStream<GoalJsonEvent>(goalId, {
      direction: BACKWARDS,
      fromRevision: END,
      maxCount: 1000,
    });

    try {
      const activities: GoalActivity[] = [];

      for await (const resolvedEvent of events) {
        activities.push({
          created: resolvedEvent.event.created,
          type: resolvedEvent.event.type,
          data: resolvedEvent.event.data,
        });
      }

      let userId: string | undefined;

      // add userId to events that don't have it for backwards compatibility. can be removed in the future.
      for (let i = activities.length - 1; i >= 0; i--) {
        const a = activities[i];

        if (a.data?.userId) {
          userId = a.data.userId;
        } else if (userId) {
          (a.data as any).userId = userId;
        }
      }

      return activities;
    } catch (error) {
      if (error instanceof StreamNotFoundError) {
        return null;
      }

      throw error;
    }
  }

  private async getEvents(aggregateId: string): Promise<Array<GoalJsonEvent['data']>> {
    const eventStream = this.eventStore.getClient().readStream<GoalJsonEvent>(aggregateId, {
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
