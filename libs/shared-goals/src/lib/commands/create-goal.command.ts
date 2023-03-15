import { ICommand } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { CreateGoalDto } from '../dto/create-goal.dto';

export class CreateGoalCommand implements ICommand {
  public readonly userId: string;
  public readonly goalId: string;
  public readonly name: string;
  public readonly target: number;

  public constructor(payload: CreateGoalDto) {
    this.userId = payload.userId;
    this.goalId = uuidv4();
    this.name = payload.name;
    this.target = payload.target;
  }
}
