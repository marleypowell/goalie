import { PureAbility } from '@casl/ability';
import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

interface ApiRequest extends Request {
  ability: PureAbility;
}

/**
 * Parameter decorator to provide the `CaslAbility` for the current user.
 * ```ts
 * ＠UseGuards(CaslGuard)
 * sample(＠CaslAbility() ability: AppAbility) { ... }
 * ```
 */
export const CaslAbility = createParamDecorator((_data: unknown, ctx: ExecutionContext): PureAbility => {
  const ability = ctx.switchToHttp().getRequest<ApiRequest>().ability;

  if (!ability) {
    throw new UnauthorizedException('No ability found for request');
  }

  return ability;
});
