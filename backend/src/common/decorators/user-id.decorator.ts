import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserId = createParamDecorator((_, context: ExecutionContext): string | null => {
  const request = context.switchToHttp().getRequest();
  return request.user?.sub ?? null;
});
