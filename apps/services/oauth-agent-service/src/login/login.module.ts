import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CookieEncryptionService } from '../lib/cookie-encryption.service';
import { CookieService } from '../lib/cookie.service';
import { CurityService } from '../lib/curity.service';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';

@Module({
  imports: [HttpModule],
  controllers: [LoginController],
  providers: [LoginService, CurityService, CookieEncryptionService, CookieService],
})
export class LoginModule {}
