import { Module } from '@nestjs/common';
import { CookieService } from '../lib/cookie.service';
import { CurityService } from '../lib/curity.service';
import { LogoutController } from './logout.controller';
import { LogoutService } from './logout.service';

@Module({
  controllers: [LogoutController],
  providers: [LogoutService, CurityService, CookieService],
})
export class LogoutModule {}
