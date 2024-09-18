import { IAdmin } from 'src/contracts';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Admin = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: IAdmin = request.user;

    return data ? user[data] : user;
  },
);
