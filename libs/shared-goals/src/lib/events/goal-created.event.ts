import { IEvent } from '@nestjs/cqrs';
import { CreateGoalCommand } from '../commands/create-goal.command';

export class GoalCreatedEvent implements IEvent {
  public readonly eventName = 'GoalCreatedEvent' as const;

  public readonly goalId: string;
  public readonly userId: string;
  public readonly name: string;
  public readonly target: number;

  public constructor(command: CreateGoalCommand) {
    this.goalId = command.goalId;
    this.userId = command.userId;
    this.name = command.name;
    this.target = command.target;
  }
}
