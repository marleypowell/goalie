import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClaimsModule } from './claims/claims.module';
import config from './config/config';
import { HealthModule } from './health/health.module';
import { LoginModule } from './login/login.module';
import { LogoutModule } from './logout/logout.module';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { UserInfoModule } from './user-info/user-info.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env.local', '.env'], load: [config] }),
    HttpModule,
    HealthModule,
    LoginModule,
    LogoutModule,
    UserInfoModule,
    RefreshTokenModule,
    ClaimsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
