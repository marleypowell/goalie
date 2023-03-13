import { Controller, Get, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { Request } from 'express';
import { ClaimsService } from './claims.service';

@Controller('claims')
export class ClaimsController {
  public constructor(private readonly claimsService: ClaimsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  public getClaims(@Req() req: Request): Record<string, any> {
    return this.claimsService.getClaims(req.cookies);
  }
}
