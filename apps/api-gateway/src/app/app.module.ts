import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import config from './config/config';
import { GoalsModule } from './goals/goals.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env.local', '.env'], load: [config] }),
    HealthModule,
    AuthModule,
    GoalsModule,
  ],
})
export class AppModule {}
