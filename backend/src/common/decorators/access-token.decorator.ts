import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AccessTokenData } from '../interfaces/access-token.type';

export const AccessToken = createParamDecorator((_, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  const user: AccessTokenData = request.user;

  if (!user) {
    throw new UnauthorizedException('Access token not provided');
  }

  return user;
});
