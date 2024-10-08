import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { REQUEST_HEADERS, ROLES_KEY, WORKSPACE } from 'src/shared/constants';
import { ERoles } from 'src/shared/enums';
import { JwtService } from '../utils';
import { UserAdminService } from 'src/modules/user-admin/user-admin.service';

@Injectable()
export class AdminRolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userAdminService: UserAdminService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles: string[] = this.reflector.get<ERoles[]>(
      ROLES_KEY,
      context.getHandler(),
    );

    if (roles === undefined || roles.length === 0) {
      return true;
    }
    const req = context.switchToHttp().getRequest();
    const token = req.headers[REQUEST_HEADERS['X-ACCESS-TOKEN']];
    const decoded = await JwtService.verifyToken(token);
    if (decoded.workspace !== WORKSPACE.ADMIN) {
      return false;
    }
    const userId = decoded.id as number;
    const userInfo = await this.userAdminService.getBasicInfoByUserId(userId);

    req.user = userInfo;
    const userRoles = userInfo.roles;

    return userRoles.some(
      (userRole) =>
        userRole.name === ERoles.SUPER_ADMIN ||
        roles.some((role) => role === userRole.name),
    );
  }
}
