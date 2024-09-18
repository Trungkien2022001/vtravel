import { ApiConfigService } from 'src/core/config/api-config.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

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
