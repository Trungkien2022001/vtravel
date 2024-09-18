import { IAdmin } from 'src/shared/interface';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
type IAdminKey = keyof IAdmin;
export const Admin = createParamDecorator(
  (data: IAdminKey | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: IAdmin = request.user;

    return data ? user[data] : user;
  },
);
