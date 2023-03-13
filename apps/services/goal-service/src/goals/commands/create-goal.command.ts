import { ICommand } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { CreateGoalDto } from '../dto/create-goal.dto';

export class CreateGoalCommand implements ICommand {
  public readonly goalId: string;
  public readonly userId: string;
  public readonly name: string;
  public readonly target: number;

  public constructor(userId: string, payload: CreateGoalDto) {
    this.goalId = uuidv4();
    this.userId = userId;
    this.name = payload.name;
    this.target = payload.target;
  }
}
