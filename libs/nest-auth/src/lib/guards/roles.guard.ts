import { ExecutionContext, Injectable, Logger, mixin } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { ALLOW_ANONYMOUS_KEY } from '../decorators/allow-anonymous.decorator';

export function RolesGuard(...roles: Array<string>) {
  if (new.target !== undefined) {
    throw new Error('RolesGuard cannot be instantiated directly. Use RolesGuard() instead.');
  }

  @Injectable()
  class MixinRolesGuard extends AuthGuard('jwt') {
    public readonly logger = new Logger(MixinRolesGuard.name);

    public constructor(public reflector: Reflector) {
      super();
    }

    public override canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
      this.logger.debug(
        `Checking if request is allowed to be anonymous`,
        JSON.stringify(context.switchToHttp().getRequest<Request>().rawHeaders)
      );

      const allowAnonymous = this.reflector.getAllAndOverride<boolean>(ALLOW_ANONYMOUS_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      if (allowAnonymous) {
        return true;
      }

      const req = context.switchToHttp().getRequest();

      if (!req.user) {
        return super.canActivate(context);
      }

      if (roles.length === 0) {
        return true;
      }

      return rbacLogic(req.user.roles, roles);
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

  return mixin(MixinRolesGuard);
}

export function rbacLogic(userRoles: string[], definedRoles: string[]): boolean {
  return definedRoles.some((definedRole) => userRoles.includes(definedRole));
}
