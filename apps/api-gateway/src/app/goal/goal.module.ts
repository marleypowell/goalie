import { NestAuthModule } from '@goalie/nest-auth';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { AppCaslFactory } from '../auth/casl/casl.factory';
import { Config } from '../config/config.interface';
import { GoalController } from './goal.controller';
import { GoalsService } from './goals.service';

@Module({
  imports: [NestAuthModule.register(AppCaslFactory)],
  controllers: [GoalController],
  providers: [
    {
      provide: 'NATS_SERVICE',
      useFactory: (config: ConfigService<Config>) =>
        ClientProxyFactory.create({
          transport: Transport.NATS,
          options: config.get('natsOptions', { infer: true }),
        }),
      inject: [ConfigService],
    },
    GoalsService,
  ],
})
export class GoalModule {}
