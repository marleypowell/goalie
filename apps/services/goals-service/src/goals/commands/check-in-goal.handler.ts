import { CheckInGoalCommand } from '@goalie/shared/goals';
import { Logger } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { GoalsRepository } from '../goals.repository';

/**
 * The checkIn goal command handler. This handler is responsible for checking in a goal.
 */
@CommandHandler(CheckInGoalCommand)
export class CheckInGoalHandler implements ICommandHandler<CheckInGoalCommand> {
  private readonly logger = new Logger(CheckInGoalHandler.name);

  public constructor(private readonly publisher: EventPublisher, private readonly goalRepository: GoalsRepository) {}

  /**
   * Get the goal by id and checkIn the goal. Save the goal.
   * @param command the command
   */
  public async execute(command: CheckInGoalCommand): Promise<void> {
    this.logger.log(`received checkIn command: ${JSON.stringify(command)}`);

    const aggregate = await this.goalRepository.getById(command.goalId);
    this.publisher.mergeObjectContext(aggregate);

    aggregate.checkIn(command);

    await this.goalRepository.save(aggregate);
  }
}
