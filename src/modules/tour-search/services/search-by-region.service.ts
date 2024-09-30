/* eslint-disable camelcase */
import { EntityManager } from 'typeorm';
import { ElasticSearchService, RedisService } from 'src/core';
import { Injectable } from '@nestjs/common';
import { DataCenterService } from 'src/modules/data-center';
import * as _ from 'lodash';
import { TourSearchByRegionDto } from '../dto';
import { TourSearchService } from './search.service';

@Injectable()
export class TourSearchbyRegionService {
  constructor(
    private readonly elasticSearchService: ElasticSearchService,
    private readonly redisService: RedisService,
    private readonly tourSearchService: TourSearchService,
    private readonly entityManager: EntityManager,
    private readonly dataCenterService: DataCenterService,
  ) {}

  async searchByRegion(body: TourSearchByRegionDto) {
    await this.tourSearchService.search(body);
  }
}
