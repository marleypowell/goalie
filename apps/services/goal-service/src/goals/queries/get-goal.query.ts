import { GetGoalDto } from '@goalie/shared/goals';
import { IQuery } from '@nestjs/cqrs';

export class GetGoalQuery implements IQuery {
  public readonly goalId: string;

  public constructor(payload: GetGoalDto) {
    this.goalId = payload.goalId;
  }
}
