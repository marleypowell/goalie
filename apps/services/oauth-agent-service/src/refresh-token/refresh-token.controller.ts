import { Controller, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { RefreshTokenService } from './refresh-token.service';

@ApiTags('refresh-token')
@Controller('refresh-token')
export class RefreshTokenController {
  public constructor(private readonly refreshTokenService: RefreshTokenService) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  public async refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<void> {
    const { cookiesToSet } = await this.refreshTokenService.refreshToken(req.cookies);
    res.set('Set-Cookie', cookiesToSet);
  }
}
