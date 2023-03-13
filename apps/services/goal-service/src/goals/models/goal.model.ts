import { CreateGoalCommand, GoalCompletedEvent, GoalCreatedEvent } from '@goalie/shared/goals';
import { Logger } from '@nestjs/common';
import { AggregateRoot, IEvent } from '@nestjs/cqrs';

export class GoalAggregate extends AggregateRoot {
  private id: string;
  private userId: string;
  private name: string;
  private target: number;
  private completed: boolean;

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

  public completeGoal(): void {
    this.logger.log(`completeGoal`);

    if (this.completed) {
      throw new Error('Goal already completed');
    }

    const event = new GoalCompletedEvent();
    this.apply(event);
  }

  public onGoalCompletedEvent(event: GoalCompletedEvent): void {
    this.logger.log(`onGoalCompletedEvent ${JSON.stringify(event)}`);
    this.completed = true;
  }

  public getUncommittedEvents(): Array<IEvent & { eventName: string }> {
    return super.getUncommittedEvents() as Array<IEvent & { eventName: string }>;
  }
}
