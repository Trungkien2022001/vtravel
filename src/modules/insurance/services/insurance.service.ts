import { AvailableService } from '../../hotel-available/service/seach.service';
import { EntityManager } from 'typeorm';
import { ElasticSearchService, RedisService } from 'src/core';
import { Injectable } from '@nestjs/common';
import { SearchByRegionDto } from 'src/modules/hotel-available/dto';
import { REDIS_EXPIRED, REDIS_KEY } from 'src/shared/constants';
import * as unidecode from 'unidecode';

@Injectable()
export class InsuranceService {
  constructor(
    private readonly elasticSearchService: ElasticSearchService,
    private readonly redisService: RedisService,
    private readonly entityManager: EntityManager,
    private readonly availableService: AvailableService,
  ) {}

  async getBasicInsuranceRate() {
    return await this.redisService.cachedExecute(
      {
        key: `${REDIS_KEY.INSURANCE}:basic`,
        ttl: REDIS_EXPIRED['1_WEEKS'],
      },
      () =>
        this.entityManager.query(`
        SELECT
          product,
          price_type,
          value_percent,
          value_amount,
          currency
        FROM insurance_basic
        WHERE is_deleted = false`),
    );
  }
}
