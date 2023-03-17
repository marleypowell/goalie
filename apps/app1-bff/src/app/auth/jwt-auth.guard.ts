import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { ALLOW_ANONYMOUS } from './allow-anonymous.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  public constructor(private reflector: Reflector) {
    super();
  }

  public override canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    this.logger.debug(
      `Checking if request is allowed to be anonymous`,
      JSON.stringify(context.switchToHttp().getRequest<Request>().rawHeaders)
    );

    const allowAnonymous = this.reflector.getAllAndOverride<boolean>(ALLOW_ANONYMOUS, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (allowAnonymous) {
      return true;
    }

    return super.canActivate(context);
  }
}
