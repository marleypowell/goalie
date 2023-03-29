import { ICommand } from '@nestjs/cqrs';
import { CheckInGoalDto } from '../dto/check-in-goal.dto';

export class CheckInGoalCommand implements ICommand {
  public readonly goalId: string;
  public readonly userId: string;
  public readonly progress: number;

  public constructor(payload: CheckInGoalDto) {
    this.goalId = payload.goalId;
    this.userId = payload.userId;
    this.progress = payload.progress;
  }
}
