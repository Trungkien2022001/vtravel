import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AgentEntity } from 'src/core/database/entities';
import { EntityManager } from 'typeorm';
import { ElasticSearchService, RedisService } from 'src/core';
import { AppError } from 'src/common';
import {
  DEFAULT_CURRENCY,
  ERROR,
  REDIS_EXPIRED,
  REDIS_KEY,
} from 'src/shared/constants';
import * as _ from 'lodash';

@Injectable()
export class CurrencyService {
  constructor(
    private readonly redisService: RedisService,
    private readonly entityManager: EntityManager,
  ) {}

  async getExchangeRate(
    reqCurrency,
    baseCurrency = DEFAULT_CURRENCY,
  ): Promise<number> {
    const pair = `${baseCurrency}${reqCurrency}`;
    const rate = await this.redisService.cachedExecute(
      {
        key: `${REDIS_KEY.CURRENCY}:${pair}`,
        ttl: REDIS_EXPIRED['1_DAYS'],
      },
      async () => {
        const exchangeRate = await this.entityManager.query(`
          SELECT pair, rate
          FROM convert_currency
          WHERE pair = '${pair}'
           and is_deleted = false`);
        if (!exchangeRate.length) {
          throw new AppError(ERROR.INVALID_CURRENCY_EXCHANGE_PAIR);
        }

        return exchangeRate[0].rate;
      },
    );

    return rate;
  }
}
