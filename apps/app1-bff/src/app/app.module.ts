import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GoalModule } from './goal/goal.module';

@Module({
  imports: [ConfigModule.forRoot(), GoalModule],
})
export class AppModule {}
