import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ApiRequest } from '../common/api-request';
import { User } from './user.model';

/**
 * The request user decorator. This decorator can be used to inject the user from the request into a controller method.
 */
export const RequestUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): User => {
  const request = ctx.switchToHttp().getRequest<ApiRequest>();
  return request.user;
});

/**
 * The request user decorator. This decorator can be used to inject the user from the request into a controller method.
 */
export const ReqUser = RequestUser;
