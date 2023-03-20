import { ICommand } from '@nestjs/cqrs';
import { DeleteGoalDto } from '../dto/delete-goal.dto';

export class DeleteGoalCommand implements ICommand {
  public readonly goalId: string;

  public constructor(payload: DeleteGoalDto) {
    this.goalId = payload.goalId;
  }
}
