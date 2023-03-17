import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventStoreModule } from './common/event-store.service';
import config from './config/config';
import { GoalsModule } from './goals/goals.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env.local', '.env'], load: [config] }),
    HttpModule,
    HealthModule,
    EventStoreModule,
    GoalsModule,
  ],
})
export class AppModule {}
