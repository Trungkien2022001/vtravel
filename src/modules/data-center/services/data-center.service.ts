import { AvailableService } from '../../hotel-available/service/seach.service';
import { EntityManager } from 'typeorm';
import { ElasticSearchService, RedisService } from 'src/core';
import { Injectable } from '@nestjs/common';
import { SearchByRegionDto } from 'src/modules/hotel-available/dto';
import { REDIS_EXPIRED, REDIS_KEY } from 'src/shared/constants';
import * as unidecode from 'unidecode';

@Injectable()
export class DataCenterService {
  constructor(
    private readonly elasticSearchService: ElasticSearchService,
    private readonly redisService: RedisService,
    private readonly entityManager: EntityManager,
    private readonly availableService: AvailableService,
  ) {}

  async searchByRegion(body: SearchByRegionDto) {
    const hotels = await this.availableService.findActiveHotelIds(body);
    const hotelIds = hotels.map((h) => h.hotel_id);

    return this.elasticSearchService.findHotelByHotelIds(hotelIds);
  }

  async getConvertCurrency(c1: string, c2: string) {
    const pair = c1 + c2;
    const rate = await this.redisService.cachedExecute(
      {
        key: `${REDIS_KEY.CURRENCY}:${pair}`,
        ttl: REDIS_EXPIRED['1_DAYS'],
      },
      async () => {
        const pairs = await this.entityManager.query(`
          SELECT pair, rate
          FROM convert_currency
          WHERE pair = '${pair}'
          and is_deleted = false`);

        return pairs[0];
      },
    );

    return rate;
  }
  async getConvertCurrencies(destCurrency: string, currencies: string[]) {
    const pairs = currencies.map((c) => `${c}${destCurrency}`);
    const rates = await this.redisService.cachedExecute(
      {
        key: `${REDIS_KEY.CURRENCIES}:${currencies.map((c) => `${c}${destCurrency}`).join(',')}`,
        ttl: REDIS_EXPIRED['1_DAYS'],
      },
      async () => {
        const pair = await this.entityManager.query(`
          SELECT pair, rate
          FROM convert_currency
          WHERE pair in (${pairs.map((p) => `'${p}'`).join(',')})
           and is_deleted = false`);
        const objPair = {};
        pair.map((p) => {
          objPair[p.pair] = p.rate;
        });

        return objPair;
      },
    );

    return rates;
  }
  async getHotelPlaceHolderSuggested(text: string) {
    const queryPhrase = unidecode(text);
    const [hotels, regions] = await Promise.all([
      await this.elasticSearchService.getHotelsFromName(queryPhrase),
      await this.elasticSearchService.getRegionsFromName(queryPhrase),
    ]);

    return {
      statistic: {
        regions: regions.length,
        hotels: hotels.length,
      },
      regions,
      hotels,
    };
  }
}
