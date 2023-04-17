import { Controller, Get, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { UserInfo } from '../lib/user-info';
import { UserInfoService } from './user-info.service';

/**
 * The user info controller. It is used to get the user info.
 */
@ApiTags('user-info')
@Controller('user-info')
export class UserInfoController {
  public constructor(private readonly userInfoService: UserInfoService) {}

  /**
   * Get the user info.
   * @param req The request.
   * @returns the user info.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user info has been successfully retrieved.',
    schema: {
      type: 'object',
      additionalProperties: true,
    },
  })
  public getUserInfo(@Req() req: Request): Promise<UserInfo> {
    return this.userInfoService.getUserInfo(req.cookies);
  }
}
