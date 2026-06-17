import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Citizen } from '@prisma/client';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Citizen | undefined => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user?: Citizen }>();
    return request.user;
  },
);
