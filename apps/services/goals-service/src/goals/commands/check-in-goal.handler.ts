import { CheckInGoalCommand } from '@goalie/shared/goals';
import { Logger } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { GoalsRepository } from '../goals.repository';

@CommandHandler(CheckInGoalCommand)
export class CheckInGoalHandler implements ICommandHandler<CheckInGoalCommand> {
  private readonly logger = new Logger(CheckInGoalHandler.name);

  public constructor(private readonly publisher: EventPublisher, private readonly goalRepository: GoalsRepository) {}

  public async execute(command: CheckInGoalCommand): Promise<void> {
    this.logger.log(`received checkIn command: ${JSON.stringify(command)}`);

    const aggregate = await this.goalRepository.getById(command.goalId);
    this.publisher.mergeObjectContext(aggregate);

    aggregate.checkIn(command);

    await this.goalRepository.save(aggregate);
  }
}
