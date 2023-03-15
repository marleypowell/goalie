import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ApiRequest } from '../common/api-request';
import { User } from './user.model';

export const RequestUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): User => {
  const request = ctx.switchToHttp().getRequest<ApiRequest>();
  return request.user;
});

export const ReqUser = RequestUser;
