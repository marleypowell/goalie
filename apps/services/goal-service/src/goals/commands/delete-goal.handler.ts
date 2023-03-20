import { DeleteGoalCommand } from '@goalie/shared/goals';
import { Logger } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { GoalRepository } from '../goal.repository';

@CommandHandler(DeleteGoalCommand)
export class DeleteGoalHandler implements ICommandHandler<DeleteGoalCommand> {
  private readonly logger = new Logger(DeleteGoalHandler.name);

  public constructor(private readonly publisher: EventPublisher, private readonly goalRepository: GoalRepository) {}

  public async execute(command: DeleteGoalCommand): Promise<void> {
    this.logger.log(`received deleteGoal command: ${JSON.stringify(command)}`);

    const aggregate = await this.goalRepository.getById(command.goalId);
    this.publisher.mergeObjectContext(aggregate);

    aggregate.deleteGoal();

    await this.goalRepository.save(aggregate);
  }
}
