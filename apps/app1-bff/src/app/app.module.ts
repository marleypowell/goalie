import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import config from './config/config';
import { GoalModule } from './goal/goal.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [config] }), AuthModule, GoalModule],
})
export class AppModule {}
