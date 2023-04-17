import { CreateGoalCommand } from '@goalie/shared/goals';
import { Logger } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { GoalsRepository } from '../goals.repository';
import { GoalAggregate } from '../models/goal.aggregate';

/**
 * The create goal command handler. This handler is responsible for creating a goal.
 */
@CommandHandler(CreateGoalCommand)
export class CreateGoalHandler implements ICommandHandler<CreateGoalCommand> {
  private readonly logger = new Logger(CreateGoalHandler.name);

  public constructor(private readonly publisher: EventPublisher, private readonly goalRepository: GoalsRepository) {}

  /**
   * Create a new goal. Save the goal.
   * @param command the command
   */
  public async execute(command: CreateGoalCommand): Promise<void> {
    this.logger.log(`received createGoal command: ${JSON.stringify(command)}`);

    const aggregate = new GoalAggregate();
    this.publisher.mergeObjectContext(aggregate);

    aggregate.createGoal(command);

    await this.goalRepository.save(aggregate);
  }
}
