/* eslint-disable @typescript-eslint/no-inferrable-types */

import {
  CheckInGoalCommand,
  CreateGoalCommand,
  GoalCheckedInEvent,
  GoalCompletedEvent,
  GoalCreatedEvent,
  GoalDeletedEvent,
} from '@goalie/shared/goals';
import { Logger } from '@nestjs/common';
import { AggregateRoot, IEvent } from '@nestjs/cqrs';

/**
 * The goal aggregate. This aggregate is responsible for managing the goal.
 */
export class GoalAggregate extends AggregateRoot {
  private id: string;
  private userId: string;
  private name: string;
  private target: number;
  private completed: boolean = false;
  private deleted: boolean = false;
  private progress: number;

  private readonly logger = new Logger(GoalAggregate.name);

  /**
   * Gets the goal id.
   * @returns the goal id
   */
  public getId(): string {
    return this.id;
  }

  /**
   * Gets the user id.
   * @returns the user id
   */
  public getUserId(): string {
    return this.userId;
  }

  /**
   * Gets the goal name.
   * @returns the goal name
   */
  public getName(): string {
    return this.name;
  }

  /**
   * Gets the goal target.
   * @returns the goal target
   */
  public getTarget(): number {
    return this.target;
  }

  /**
   * Gets the goal completed flag.
   * @returns the goal completed flag
   */
  public getCompleted(): boolean {
    return this.completed;
  }

  /**
   * Gets the goal deleted flag.
   * @returns the goal deleted flag
   */
  public getDeleted(): boolean {
    return this.deleted;
  }

  /**
   * Gets the goal progress.
   * @returns the goal progress
   */
  public getProgress(): number {
    return this.progress;
  }

  /**
   * Creates a goal.
   * @param command the command
   */
  public createGoal(command: CreateGoalCommand): void {
    this.logger.log(`createGoal: ${JSON.stringify(command)}`);
    const event = new GoalCreatedEvent(command);
    this.apply(event);
  }

  /**
   * Handle the goal created event and update aggregate.
   * This method is called by the event bus when the goal created event is published.
   * @param event the event
   */
  public onGoalCreatedEvent(event: GoalCreatedEvent): void {
    this.logger.log(`onGoalCreatedEvent: ${JSON.stringify(event)}`);
    this.id = event.goalId;
    this.userId = event.userId;
    this.name = event.name;
    this.target = event.target;
  }

  /**
   * Checks in a goal.
   * @param command the command
   */
  public checkIn(command: CheckInGoalCommand): void {
    this.logger.log(`checkIn: ${JSON.stringify(command)}`);
    const event = new GoalCheckedInEvent(command);
    this.apply(event);
  }

  /**
   * Handle the goal checked in event and update aggregate.
   * This method is called by the event bus when the goal checked in event is published.
   * @param event the event
   */
  public onGoalCheckedInEvent(event: GoalCheckedInEvent): void {
    this.logger.log(`onGoalCheckedInEvent: ${JSON.stringify(event)}`);

    if (this.deleted) {
      throw new Error('Goal is deleted');
    }

    if (this.completed) {
      throw new Error('Goal is completed');
    }

    if (event.progress > this.target) {
      throw new Error('Progress cannot exceed target');
    }

    this.progress = event.progress;

    if (this.progress === this.target) {
      this.completeGoal();
    }
  }

  /**
   * Completes a goal.
   */
  public completeGoal(): void {
    this.logger.log(`completeGoal`);

    if (this.deleted) {
      throw new Error('Goal is deleted');
    }

    if (this.completed) {
      throw new Error('Goal is already completed');
    }

    const event = new GoalCompletedEvent();
    this.apply(event);
  }

  /**
   * Handle the goal completed event and update aggregate.
   * This method is called by the event bus when the goal completed event is published.
   * @param event the event
   */
  public onGoalCompletedEvent(event: GoalCompletedEvent): void {
    this.logger.log(`onGoalCompletedEvent ${JSON.stringify(event)}`);
    this.progress = this.target;
    this.completed = true;
  }

  /**
   * Deletes a goal.
   */
  public deleteGoal(): void {
    this.logger.log(`deleteGoal`);

    if (this.deleted) {
      throw new Error('Goal is already deleted');
    }

    const event = new GoalDeletedEvent();
    this.apply(event);
  }

  /**
   * Handle the goal deleted event and update aggregate.
   * This method is called by the event bus when the goal deleted event is published.
   * @param event the event
   */
  public onGoalDeletedEvent(event: GoalDeletedEvent): void {
    this.logger.log(`onGoalDeletedEvent ${JSON.stringify(event)}`);
    this.deleted = true;
  }

  /**
   * Gets the uncommitted events.
   * @returns the uncommitted events
   */
  public getUncommittedEvents(): Array<IEvent & { eventName: string }> {
    return super.getUncommittedEvents() as Array<IEvent & { eventName: string }>;
  }
}
