import { Controller, Post, UseGuards } from '@nestjs/common';
import { Roles } from 'src/common/decorators';
import { ERoles } from 'src/shared/enums';
import { AdminRolesGuard } from 'src/common/guards';
import { DevSupportService, CrawlerService } from './services';
import { ApiTags } from '@nestjs/swagger';

@Controller('v1/dev-support')
@ApiTags('Dev Support Component')
export class DevSupportController {
  constructor(
    private readonly devSupportService: DevSupportService,
    private readonly crawlerService: CrawlerService,
  ) {}

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

  @Post('elasticsearch/bulk/airport')
  @Roles(ERoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  bulkAirportElasticsearch() {
    return this.devSupportService.bulkInsertAirportslElasticseach();
  }

  @Post('elasticsearch/bulk/room')
  @Roles(ERoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  bulkRoomsElasticsearch() {
    return this.devSupportService.bulkInsertRoomslElasticseach();
  }

  @Post('elasticsearch/bulk/tour')
  @Roles(ERoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  bulkToursElasticsearch() {
    return this.devSupportService.bulkInsertTourslElasticseach();
  }

  @Post('elasticsearch/bulk/vehicle')
  @Roles(ERoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  bulkVehiclesElasticsearch() {
    return this.devSupportService.bulkInsertVehicleslElasticseach();
  }

  @Post('crawler/hotel')
  @Roles(ERoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  crawlerHotel() {
    return this.crawlerService.crawlerHotel();
  }
}
