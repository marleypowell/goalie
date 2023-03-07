import { Module } from '@nestjs/common';
import { CookieModule } from '../lib/cookie.service';
import { CurityModule } from '../lib/curity.service';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';

@Module({
  imports: [CurityModule, CookieModule],
  controllers: [LoginController],
  providers: [LoginService],
})
export class LoginModule {}
