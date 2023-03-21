import { CompleteGoalCommand } from '@goalie/shared/goals';
import { Logger } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { GoalsRepository } from '../goals.repository';

@CommandHandler(CompleteGoalCommand)
export class CompleteGoalHandler implements ICommandHandler<CompleteGoalCommand> {
  private readonly logger = new Logger(CompleteGoalHandler.name);

  public constructor(private readonly publisher: EventPublisher, private readonly goalRepository: GoalsRepository) {}

  public async execute(command: CompleteGoalCommand): Promise<void> {
    this.logger.log(`received completeGoal command: ${JSON.stringify(command)}`);

    const aggregate = await this.goalRepository.getById(command.goalId);
    this.publisher.mergeObjectContext(aggregate);

    aggregate.completeGoal();

    await this.goalRepository.save(aggregate);
  }
}
