import { GetGoalsDto } from '@goalie/shared/goals';
import { IQuery } from '@nestjs/cqrs';

export class GetGoalsQuery implements IQuery {
  public readonly userId?: string;

  public constructor(payload: GetGoalsDto) {
    this.userId = payload.userId;
  }
}
