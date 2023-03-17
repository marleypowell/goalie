import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EventStoreModule } from '../common/event-store.service';
import { CommandHandlers } from './commands';
import { EventHandlers } from './events';
import { GoalRepository } from './goal.repository';
import { GoalsController } from './goals.controller';
import { QueryHandlers } from './queries';

@Module({
  imports: [CqrsModule, EventStoreModule],
  controllers: [GoalsController],
  providers: [GoalRepository, ...CommandHandlers, ...QueryHandlers, ...EventHandlers],
})
export class GoalsModule {}
