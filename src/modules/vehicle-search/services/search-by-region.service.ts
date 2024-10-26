/* eslint-disable camelcase */
import { EntityManager } from 'typeorm';
import { ElasticSearchService, RedisService } from 'src/core';
import { Injectable } from '@nestjs/common';
import { DataCenterService } from 'src/modules/data-center';
import * as _ from 'lodash';
import { VehicleSearchByRegionDto } from '../dto';
import { VehicleSearchService } from './search.service';
import { VehicleProviderSearchService } from './search-provider.sevice';

@Injectable()
export class VehicleSearchbyRegionService {
  constructor(
    private readonly elasticSearchService: ElasticSearchService,
    private readonly redisService: RedisService,
    private readonly vehicleSearchService: VehicleSearchService,
    private readonly vehicleProviderSearchService: VehicleProviderSearchService,
    private readonly entityManager: EntityManager,
    private readonly dataCenterService: DataCenterService,
  ) {}

  async search(body: VehicleSearchByRegionDto, agentId: number) {
    return await this.vehicleProviderSearchService.search(body, agentId);
  }
}
