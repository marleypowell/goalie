import { Body, Controller, HttpCode, HttpStatus, Logger, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoginEndDto } from './dto/login-end.dto';
import { LoginService } from './login.service';
import { LoginEndResponse } from './models/login-end-response';
import { LoginStartResponse } from './models/login-start-response';

@Controller('login')
export class LoginController {
  private readonly logger = new Logger(LoginController.name);

  public constructor(private readonly loginService: LoginService) {}

  @Post('/start')
  @HttpCode(HttpStatus.OK)
  public loginStart(@Res({ passthrough: true }) res: Response): LoginStartResponse {
    const { tempLoginDataCookie, ...response } = this.loginService.loginStart();
    res.set('Set-Cookie', tempLoginDataCookie);
    return response;
  }

  @Post('/end')
  @HttpCode(HttpStatus.OK)
  public async loginEnd(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() payload: LoginEndDto
  ): Promise<LoginEndResponse> {
    const { cookiesToSet, ...response } = await this.loginService.loginEnd(payload.pageUrl, req.cookies);
    if (cookiesToSet) {
      this.logger.debug('cookiesToSet', cookiesToSet);
      res.set('Set-Cookie', cookiesToSet);
    }
    return response;
  }
}
