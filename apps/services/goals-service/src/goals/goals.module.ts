import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EventStoreModule } from '../common/event-store.service';
import { CommandHandlers } from './commands';
import { EventHandlers } from './events';
import { GoalsController } from './goals.controller';
import { GoalsRepository } from './goals.repository';
import { QueryHandlers } from './queries';

@Module({
  imports: [CqrsModule, EventStoreModule],
  controllers: [GoalsController],
  providers: [GoalsRepository, ...CommandHandlers, ...QueryHandlers, ...EventHandlers],
})
export class GoalsModule {}
