import { Module } from '@nestjs/common';
import { CookieModule } from '../lib/cookie.service';
import { CurityModule } from '../lib/curity.service';
import { UserInfoController } from './user-info.controller';
import { UserInfoService } from './user-info.service';

@Module({
  imports: [CurityModule, CookieModule],
  controllers: [UserInfoController],
  providers: [UserInfoService],
})
export class UserInfoModule {}
