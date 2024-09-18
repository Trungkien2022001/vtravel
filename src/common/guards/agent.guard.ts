import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { REQUEST_HEADERS, ROLES_KEY, WORKSPACE } from 'src/shared/constants';
import { ERoles } from 'src/shared/enums';
import { UserService } from 'src/modules/user/agent.service';
import { JwtService } from '../utils';

@Injectable()
export class AgentRolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userAgentService: UserService,
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
    if (decoded.workspace !== WORKSPACE.AGENT) {
      return false;
    }
    const userId = decoded.id as number;
    const userInfo = await this.userAgentService.getAgentResources(userId);

    req.user = userInfo;
    const userRoles = userInfo.roles;

    return userRoles.some((userRole) =>
      roles.some((role) => role === userRole.name),
    );
  }
}
