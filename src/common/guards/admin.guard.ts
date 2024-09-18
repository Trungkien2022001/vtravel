import { JwtService } from './../../modules/auth/jwt.service';
import { UserAdminService } from './../../modules/user-admin/user-admin.service';
import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { HEADER_LANG, REQUEST_HEADERS, ROLES_KEY } from 'src/shared/constants';
import { ERoles } from 'src/shared/enums';

@Injectable()
export class AdminRolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userAdminService: UserAdminService,
    private readonly jwtService: JwtService,
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
    const decoded = await this.jwtService.verifyToken(token);
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
