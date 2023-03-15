import { Controller, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { LogoutService } from './logout.service';
import { LogoutResponse } from './models/logout-response.model';

@ApiTags('logout')
@Controller('logout')
export class LogoutController {
  public constructor(private readonly logoutService: LogoutService) {}

  /**
   * Logout.
   * @param req the request.
   * @param res the response.
   * @returns the logout response.
   */
  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The logout response has been successfully retrieved.',
    type: LogoutResponse,
  })
  public logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): LogoutResponse {
    const { cookiesToSet, ...response } = this.logoutService.getLogoutResponse(req.cookies);
    res.set('Set-Cookie', cookiesToSet as string[]);
    return response;
  }
}
