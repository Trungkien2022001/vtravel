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
import { TourSearchByAirportCodeDto } from '../dto';
import { TourSearchService } from './search.service';

@Injectable()
export class TourSearchbyAirportCodeService {
  constructor(
    private readonly elasticSearchService: ElasticSearchService,
    private readonly redisService: RedisService,
    private readonly tourSearchService: TourSearchService,
    private readonly entityManager: EntityManager,
    private readonly regionMappingService: RegionMappingService,
    private readonly dataCenterService: DataCenterService,
  ) {}

  async search(body: TourSearchByAirportCodeDto) {
    const { airport_code: airportCode, ...others } = body;
    const regionId =
      await this.regionMappingService.getRegionFromDestination(airportCode);

    return await this.tourSearchService.search({
      ...others,
      region_id: regionId,
    });
  }
}
