/* eslint-disable camelcase */
import { EntityManager } from 'typeorm';
import { ElasticSearchService, RedisService } from 'src/core';
import { Injectable } from '@nestjs/common';
import { DataCenterService } from 'src/modules/data-center';
import * as _ from 'lodash';
import { VehicleSearchByIdDto } from '../dto';
import { VehicleSearchService } from './search.service';

@Injectable()
export class VehicleSearchbyIdService {
  constructor(
    private readonly elasticSearchService: ElasticSearchService,
    private readonly redisService: RedisService,
    private readonly VehicleSearchService: VehicleSearchService,
    private readonly entityManager: EntityManager,
    private readonly dataCenterService: DataCenterService,
  ) {}

  async search(body: VehicleSearchByIdDto) {
    // return await this.VehicleSearchService.search(body);
  }
}
