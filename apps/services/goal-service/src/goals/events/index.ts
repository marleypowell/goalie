import { JSONEventType } from '@eventstore/db-client';
import { GoalCompletedEvent } from './goal-completed.event';
import { GoalCompletedHandler } from './goal-completed.handler';
import { GoalCreatedEvent } from './goal-created.event';
import { GoalCreatedHandler } from './goal-created.handler';

export const EventHandlers = [GoalCreatedHandler, GoalCompletedHandler];

/**
 * This type is used to create a union of all the JSONEventType types for each event.
 */
type JsonEvent<T extends { eventName: string }> = {
  [P in keyof T]: JSONEventType<T['eventName'], { [P in keyof Omit<T, 'eventName'>]: T[P] }>;
}[keyof T];

export type GoalEvent = GoalCreatedEvent | GoalCompletedEvent;
export type GoalJsonEvent = JsonEvent<GoalEvent>;
