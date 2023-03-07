import { Controller, Get, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { Request } from 'express';
import { UserInfo } from '../lib/user-info';
import { UserInfoService } from './user-info.service';

@Controller('user-info')
export class UserInfoController {
  public constructor(private readonly userInfoService: UserInfoService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  public getUserInfo(@Req() req: Request): Promise<UserInfo> {
    return this.userInfoService.getUserInfo(req.cookies);
  }
}
