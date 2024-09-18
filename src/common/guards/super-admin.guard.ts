import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ApiConfigService } from 'src/core';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  constructor(private apiConfigService: ApiConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authorization: string = request.headers['x-key'];

    const superAdminKey = this.apiConfigService.getAdminKey('SUPER_ADMIN_KEY');

    return authorization === superAdminKey;
  }
}
