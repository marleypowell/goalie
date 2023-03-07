import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from './config/config';
import { LoginModule } from './login/login.module';
import { LogoutModule } from './logout/logout.module';
import { UserInfoModule } from './user-info/user-info.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [config] }), LoginModule, LogoutModule, UserInfoModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
