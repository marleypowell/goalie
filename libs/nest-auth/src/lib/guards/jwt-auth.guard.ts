import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { ALLOW_ANONYMOUS_KEY } from '../decorators/allow-anonymous.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  public constructor(protected readonly reflector: Reflector) {
    super();
  }

  public override canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const allowAnonymous = this.reflector.getAllAndOverride<boolean>(ALLOW_ANONYMOUS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (allowAnonymous) {
      return true;
    }

    return super.canActivate(context);
  }

  public override handleRequest(err: any, user: any, info: any, context: ExecutionContext, status: any): any {
    this.logger.debug(
      `Handling request: ${JSON.stringify({
        err: err || null,
        user: user || null,
        info: info || null,
        status: status || null,
      })}`
    );

    return super.handleRequest(err, user, info, context, status);
  }
}
