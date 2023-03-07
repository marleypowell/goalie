import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CookieEncryptionService } from '../lib/cookie-encryption.service';
import { CookieService } from '../lib/cookie.service';
import { CurityService } from '../lib/curity.service';
import { LogoutController } from './logout.controller';
import { LogoutService } from './logout.service';

@Module({
  imports: [HttpModule],
  controllers: [LogoutController],
  providers: [LogoutService, CurityService, CookieService, CookieEncryptionService, ConfigService],
})
export class LogoutModule {}
