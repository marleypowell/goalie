import { Body, Controller, Get, HttpCode, HttpStatus, Logger, Post, Req, Res } from '@nestjs/common';
import { ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { LoginEndDto } from './dto/login-end.dto';
import { LoginStartDto } from './dto/login-start.dto';
import { LoginService } from './login.service';
import { LoginEndResponse } from './models/login-end-response.model';
import { LoginStartResponse } from './models/login-start-response.model';

@ApiTags('login')
@Controller('login')
export class LoginController {
  private readonly logger = new Logger(LoginController.name);

  public constructor(private readonly loginService: LoginService) {}

  /**
   * Start the login process.
   * @param res The response.
   * @param payload The payload.
   * @returns the login start response.
   */
  @Post('/start')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The login has been successfully started.',
    type: LoginStartResponse,
  })
  public loginStart(@Res({ passthrough: true }) res: Response, @Body() payload: LoginStartDto): LoginStartResponse {
    const { tempLoginDataCookie, ...response } = this.loginService.loginStart(payload.path);
    res.set('Set-Cookie', tempLoginDataCookie);
    return response;
  }

  /**
   * End the login process.
   * @param req the request.
   * @param res the response.
   * @param payload the payload.
   * @returns the login end response.
   */
  @Post('/end')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The login has been successfully ended.',
    type: LoginEndResponse,
  })
  public async loginEnd(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() payload: LoginEndDto
  ): Promise<LoginEndResponse> {
    const { cookiesToSet, ...response } = await this.loginService.loginEnd(payload.pageUrl, req.cookies);
    if (cookiesToSet) {
      this.logger.debug(`cookiesToSet: ${JSON.stringify(cookiesToSet)}`);
      res.set('Set-Cookie', cookiesToSet);
    }
    return response;
  }

  /**
   * Get the CSRF token.
   * @param req The request.
   * @returns the CSRF token.
   */
  @Get('/token')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, description: 'The CSRF token has been successfully retrieved.', type: String })
  @ApiProduces('text/plain')
  public getCsrfToken(@Req() req): string {
    return req.csrfToken();
  }
}
