import { Controller, Post, UseGuards } from '@nestjs/common';
import { Roles } from 'src/common/decorators';
import { ERoles } from 'src/shared/enums';
import { AdminRolesGuard } from 'src/common/guards';
import { DevSupportService } from './services';
import { ApiTags } from '@nestjs/swagger';

@Controller('v1/dev-support')
@ApiTags('Dev Support Component')
export class DevSupportController {
  constructor(private readonly devSupportService: DevSupportService) {}

  @Post('elasticsearch/entrypoint')
  @Roles(ERoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  entryPoint() {
    return this.devSupportService.elasticseachEntryPoint();
  }

  @Post('elasticsearch/bulk/hotel')
  @Roles(ERoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  bulkHotelElasticsearch() {
    return this.devSupportService.bulkInsertHotelElasticseach();
  }

  @Post('elasticsearch/bulk/region')
  @Roles(ERoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  bulkRegionElasticsearch() {
    return this.devSupportService.bulkInsertRegionslElasticseach();
  }
  @Post('elasticsearch/bulk/room')
  @Roles(ERoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  bulkRRoomsElasticsearch() {
    return this.devSupportService.bulkInsertRRoomslElasticseach();
  }
}
