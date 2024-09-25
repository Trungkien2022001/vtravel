import { Controller, Post, UseGuards } from '@nestjs/common';
import { Roles } from 'src/common/decorators';
import { ERoles } from 'src/shared/enums';
import { AdminRolesGuard } from 'src/common/guards';
import { DevSupportService } from './services';

@Controller('v1/dev-support')
export class DevSupportController {
  constructor(private readonly devSupportService: DevSupportService) {}

  @Post('elasticsearch')
  @Roles(ERoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  findOne() {}
}
