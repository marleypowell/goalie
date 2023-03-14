import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { ALLOW_ANONYMOUS } from './allow-anonymous.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  public constructor(private reflector: Reflector) {
    super();
  }

  public override canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
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
