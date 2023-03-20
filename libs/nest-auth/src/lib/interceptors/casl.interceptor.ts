import {
  applyDecorators,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { CaslFactory } from '../casl.factory';

@Injectable()
export class CaslInterceptor implements NestInterceptor {
  public constructor(private readonly caslFactory: CaslFactory) {}

  public intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();

    if (!request.ability) {
      request.ability = this.caslFactory.createAbility(request.user);
    }

    return next.handle();
  }
}

export function UseCasl() {
  return applyDecorators(UseInterceptors(CaslInterceptor));
}
