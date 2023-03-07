import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CookieEncryptionService } from '../lib/cookie-encryption.service';
import { CookieService } from '../lib/cookie.service';
import { CurityService } from '../lib/curity.service';
import { UserInfoController } from './user-info.controller';
import { UserInfoService } from './user-info.service';

@Module({
  imports: [HttpModule],
  controllers: [UserInfoController],
  providers: [UserInfoService, CurityService, CookieService, CookieEncryptionService],
})
export class UserInfoModule {}
