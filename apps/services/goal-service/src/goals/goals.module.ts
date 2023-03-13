import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers } from './commands';
import { EventHandlers } from './events';
import { GoalRepository } from './goal.repository';
import { GoalsController } from './goals.controller';

@Module({
  imports: [CqrsModule],
  controllers: [GoalsController],
  providers: [GoalRepository, ...CommandHandlers, ...EventHandlers],
})
export class GoalsModule {}
