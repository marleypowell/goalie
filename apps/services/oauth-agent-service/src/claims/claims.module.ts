import { Module } from '@nestjs/common';
import { CookieModule } from '../lib/cookie.service';
import { ClaimsController } from './claims.controller';
import { ClaimsService } from './claims.service';

@Module({
  imports:[ CookieModule],
  controllers: [ClaimsController],
  providers: [ClaimsService],
})
export class ClaimsModule {}
