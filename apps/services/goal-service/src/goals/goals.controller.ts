import { Controller, HttpStatus, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CompleteGoalCommand } from './commands/complete-goal.command';
import { CreateGoalCommand } from './commands/create-goal.command';
import { CompleteGoalDto } from './dto/complete-goal.dto';
import { CreateGoalDto } from './dto/create-goal.dto';

@Controller()
export class GoalsController {
  private readonly logger = new Logger(GoalsController.name);

  public constructor(private readonly commandBus: CommandBus) {}

  @MessagePattern('createGoal')
  public async create(@Payload() payload: CreateGoalDto) {
    this.logger.log(`Received createGoal command: ${JSON.stringify(payload)}`);

    const command = new CreateGoalCommand(this.getUserId(), payload);

    await this.commandBus.execute(command);

    return { status: HttpStatus.CREATED, data: command.goalId, error: null };
  }

  @MessagePattern('completeGoal')
  public async complete(@Payload() payload: CompleteGoalDto) {
    const command = new CompleteGoalCommand(payload);

    await this.commandBus.execute(command);

    return { status: HttpStatus.OK, data: 'SUCCESS', error: null };
  }

  private getUserId(): string {
    return 'user1';
  }
}
