import { IAdmin } from 'src/contracts';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
type IAdminrKey = keyof IAdmin;
export const Admin = createParamDecorator(
  (data: IAdminrKey | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: IAdmin = request.user;

    return data ? user[data] : user;
  },
);
