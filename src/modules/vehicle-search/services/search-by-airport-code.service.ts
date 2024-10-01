/* eslint-disable camelcase */
import { EntityManager } from 'typeorm';
import {
  ElasticSearchService,
  RedisService,
  RegionMappingService,
} from 'src/core';
import { Injectable } from '@nestjs/common';
import { DataCenterService } from 'src/modules/data-center';
import * as _ from 'lodash';
import { VehicleSearchByAirportCodeDto } from '../dto';
import { VehicleSearchService } from './search.service';

@Injectable()
export class VehicleSearchbyAirportCodeService {
  constructor(
    private readonly elasticSearchService: ElasticSearchService,
    private readonly redisService: RedisService,
    private readonly VehicleSearchService: VehicleSearchService,
    private readonly entityManager: EntityManager,
    private readonly regionMappingService: RegionMappingService,
    private readonly dataCenterService: DataCenterService,
  ) {}

  async search(body: VehicleSearchByAirportCodeDto) {
    const { airport_code: airportCode, ...others } = body;
    const regionId =
      await this.regionMappingService.getRegionFromDestination(airportCode);

    return await this.VehicleSearchService.search({
      ...others,
      region_id: regionId,
    });
  }
}
