import { Logger } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { GoalRepository } from '../goal.repository';
import { GoalAggregate } from '../models/goal.model';
import { CreateGoalCommand } from './create-goal.command';

@CommandHandler(CreateGoalCommand)
export class CreateGoalHandler implements ICommandHandler<CreateGoalCommand> {
  private readonly logger = new Logger(CreateGoalHandler.name);

  public constructor(private readonly publisher: EventPublisher, private readonly goalRepository: GoalRepository) {}

  public async execute(command: CreateGoalCommand): Promise<void> {
    this.logger.log(`received createGoal command: ${JSON.stringify(command)}`);

    const aggregate = new GoalAggregate();
    this.publisher.mergeObjectContext(aggregate);

    aggregate.createGoal(command);

    await this.goalRepository.save(aggregate);
  }
}
