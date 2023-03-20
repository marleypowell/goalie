import {
  applyDecorators,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class DtoUserIdInterceptor implements NestInterceptor {
  public intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    request.body['userId'] = request.user.userId;
    return next.handle();
  }
}

export function UseDtoUserId() {
  return applyDecorators(UseInterceptors(DtoUserIdInterceptor));
}
