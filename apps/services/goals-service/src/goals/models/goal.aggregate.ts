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

export class GoalAggregate extends AggregateRoot {
  private id: string;
  private userId: string;
  private name: string;
  private target: number;
  private completed: boolean = false;
  private deleted: boolean = false;
  private progress: number;

  private readonly logger = new Logger(GoalAggregate.name);

  public getId(): string {
    return this.id;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getName(): string {
    return this.name;
  }

  public getTarget(): number {
    return this.target;
  }

  public getCompleted(): boolean {
    return this.completed;
  }

  public getDeleted(): boolean {
    return this.deleted;
  }

  public getProgress(): number {
    return this.progress;
  }

  public createGoal(command: CreateGoalCommand): void {
    this.logger.log(`createGoal: ${JSON.stringify(command)}`);
    const event = new GoalCreatedEvent(command);
    this.apply(event);
  }

  public onGoalCreatedEvent(event: GoalCreatedEvent): void {
    this.logger.log(`onGoalCreatedEvent: ${JSON.stringify(event)}`);
    this.id = event.goalId;
    this.userId = event.userId;
    this.name = event.name;
    this.target = event.target;
  }

  public checkIn(command: CheckInGoalCommand): void {
    this.logger.log(`checkIn: ${JSON.stringify(command)}`);
    const event = new GoalCheckedInEvent(command);
    this.apply(event);
  }

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

  public onGoalCompletedEvent(event: GoalCompletedEvent): void {
    this.logger.log(`onGoalCompletedEvent ${JSON.stringify(event)}`);
    this.progress = this.target;
    this.completed = true;
  }

  public deleteGoal(): void {
    this.logger.log(`deleteGoal`);

    if (this.deleted) {
      throw new Error('Goal is already deleted');
    }

    const event = new GoalDeletedEvent();
    this.apply(event);
  }

  public onGoalDeletedEvent(event: GoalDeletedEvent): void {
    this.logger.log(`onGoalDeletedEvent ${JSON.stringify(event)}`);
    this.deleted = true;
  }

  public getUncommittedEvents(): Array<IEvent & { eventName: string }> {
    return super.getUncommittedEvents() as Array<IEvent & { eventName: string }>;
  }
}
