import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory } from '@nestjs/microservices';
import { GoalsServiceOptions } from '../config/config.interface';
import { GoalController } from './goal.controller';

@Module({
  controllers: [GoalController],
  providers: [
    {
      provide: 'GOALS_SERVICE',
      useFactory: (config: ConfigService) => {
        const goalsServiceOptions = config.get<GoalsServiceOptions>('goalsServiceOptions');
        return ClientProxyFactory.create(goalsServiceOptions);
      },
      inject: [ConfigService],
    },
  ],
})
export class GoalModule {}
