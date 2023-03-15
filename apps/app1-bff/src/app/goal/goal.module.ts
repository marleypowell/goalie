import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory } from '@nestjs/microservices';
import { Config } from '../config/config.interface';
import { GoalController } from './goal.controller';
import { GoalsService } from './goals.service';

@Module({
  controllers: [GoalController],
  providers: [
    {
      provide: 'GOALS_SERVICE',
      useFactory: (config: ConfigService<Config>) => {
        const goalsServiceOptions = config.get('goalsServiceOptions', { infer: true });
        return ClientProxyFactory.create(goalsServiceOptions);
      },
      inject: [ConfigService],
    },
    GoalsService,
  ],
})
export class GoalModule {}
