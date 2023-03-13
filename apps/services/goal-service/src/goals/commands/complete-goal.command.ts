import { ICommand } from '@nestjs/cqrs';
import { CompleteGoalDto } from '../dto/complete-goal.dto';

export class CompleteGoalCommand implements ICommand {
  public readonly goalId: string;

  public constructor(payload: CompleteGoalDto) {
    this.goalId = payload.goalId;
  }
}
