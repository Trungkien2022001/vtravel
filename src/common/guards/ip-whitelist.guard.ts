import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import {
  REQUEST_HEADERS,
  ROLES_KEY,
  SEARCH_ERROR,
  WORKSPACE,
} from 'src/shared/constants';
import { ERoles } from 'src/shared/enums';
import { UserService } from 'src/modules/user/agent.service';
import { isIpWhitelisted, JwtService } from '../utils';
import { AppError } from '../errors';

@Injectable()
export class AgentIpWhitelistGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userAgentService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (!user.ip_checked) {
      return true;
    }
    const clientIp =
      req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
    const whitelist = user.whitelist_ips;
    const isAllowed = isIpWhitelisted(clientIp, whitelist);
    if (!isAllowed) {
      throw new AppError(SEARCH_ERROR.IP_IS_NOT_REGISTERED);
    }

    return true;
  }
}
