import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import config from './config/config';
import { GoalModule } from './goal/goal.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env.local', '.env'], load: [config] }),
    HealthModule,
    AuthModule,
    GoalModule,
  ],
})
export class AppModule {}
