import { Module } from '@nestjs/common';
import { CookieModule } from '../lib/cookie.service';
import { CurityModule } from '../lib/curity.service';
import { RefreshTokenController } from './refresh-token.controller';
import { RefreshTokenService } from './refresh-token.service';

@Module({
  imports: [CurityModule, CookieModule],
  controllers: [RefreshTokenController],
  providers: [RefreshTokenService],
})
export class RefreshTokenModule {}
