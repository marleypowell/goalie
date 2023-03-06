import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoginService } from './login.service';

export interface LoginStartRequest {
  extraParams?: Array<{ key: string; value: string }>;
}

export interface LoginStartResponse {
  authorizationRequestUrl: string;
}

export interface LoginEndResponse {
  isLoggedIn: boolean;
  handled: boolean;
}

@Controller('login')
export class LoginController {
  public constructor(private readonly loginService: LoginService) {}

  @Post('/start')
  public loginStart(@Res({ passthrough: true }) res: Response): LoginStartResponse {
    const { tempLoginDataCookie, ...response } = this.loginService.loginStart();
    res.set('Set-Cookie', tempLoginDataCookie);
    return response;
  }

  @Post('/end')
  public async loginEnd(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() payload: { pageUrl: string }
  ): Promise<LoginEndResponse> {
    const { cookiesToSet, ...response } = await this.loginService.loginEnd(payload.pageUrl, req.cookies);
    res.set('Set-Cookie', cookiesToSet as string[]);
    return response;
  }
}
