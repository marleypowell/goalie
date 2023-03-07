import { Module } from '@nestjs/common';
import { CookieModule } from '../lib/cookie.service';
import { CurityModule } from '../lib/curity.service';
import { LogoutController } from './logout.controller';
import { LogoutService } from './logout.service';

@Module({
  imports: [CurityModule, CookieModule],
  controllers: [LogoutController],
  providers: [LogoutService],
})
export class LogoutModule {}
