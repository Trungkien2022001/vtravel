import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUser } from 'src/shared/interface';
type IUserKey = keyof IUser;
export const User = createParamDecorator(
  (data: IUserKey | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: IUser = request.user;

    return data ? user[data] : user;
  },
);
