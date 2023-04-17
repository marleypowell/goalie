import { Controller, Get, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { ClaimsService } from './claims.service';

/**
 * The claims controller. It is used to get claims from the access token.
 */
@ApiTags('claims')
@Controller('claims')
export class ClaimsController {
  public constructor(private readonly claimsService: ClaimsService) {}

  /**
   * Get claims from the access token.
   * @param req The request.
   * @returns the claims.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The claims have been successfully retrieved.',
    schema: {
      type: 'object',
      additionalProperties: true,
    },
  })
  public getClaims(@Req() req: Request): Record<string, any> {
    return this.claimsService.getClaims(req.cookies);
  }
}
