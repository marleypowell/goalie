import { Controller, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { RefreshTokenService } from './refresh-token.service';

@ApiTags('refresh-token')
@Controller('refresh-token')
export class RefreshTokenController {
  public constructor(private readonly refreshTokenService: RefreshTokenService) {}

  /**
   * Refresh the refresh token.
   * @param req the request.
   * @param res the response.
   */
  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The refresh token has been successfully refreshed.' })
  public async refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<void> {
    const { cookiesToSet } = await this.refreshTokenService.refreshToken(req.cookies);
    res.set('Set-Cookie', cookiesToSet);
  }
}
