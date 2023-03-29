import { JSONEventType, RecordedEvent } from '@eventstore/db-client';
import { GoalCheckedInEvent } from './goal-checked-in.event';
import { GoalCompletedEvent } from './goal-completed.event';
import { GoalCreatedEvent } from './goal-created.event';
import { GoalDeletedEvent } from './goal-delete.event';

/**
 * This type is used to create a union of all the JSONEventType types for each event.
 */
type JsonEvent<T extends { eventName: string }> = {
  [P in keyof T]: JSONEventType<T['eventName'], { [P in keyof Omit<T, 'eventName'>]: T[P] }>;
}[keyof T];

export type GoalEvent = GoalCreatedEvent | GoalCompletedEvent | GoalDeletedEvent | GoalCheckedInEvent;
export type GoalJsonEvent = JsonEvent<GoalEvent>;
export type GoalRecordedEvent = RecordedEvent<GoalJsonEvent>;
