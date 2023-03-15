import { Controller, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { LogoutService } from './logout.service';
import { LogoutResponse } from './models/logout-response';

@ApiTags('logout')
@Controller('logout')
export class LogoutController {
  public constructor(private readonly logoutService: LogoutService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  public logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): LogoutResponse {
    const { cookiesToSet, ...response } = this.logoutService.getLogoutResponse(req.cookies);
    res.set('Set-Cookie', cookiesToSet as string[]);
    return response;
  }
}
