import { HotelMappingService, RedisService } from 'src/core';
import { EntityManager } from 'typeorm';
import { HelperService } from './helper.service';
import { Injectable } from '@nestjs/common';
import { HotelProvider } from 'src/shared';
import {
  DEFAULT_HOTEL_PROVIDER_ID,
  REDIS_EXPIRED,
  REDIS_KEY,
} from 'src/shared/constants';
import { SearchByRegionDto } from '../../dto';

@Injectable()
export class JuniperSearchService {
  constructor(
    protected readonly entityManager: EntityManager,
    protected readonly redisService: RedisService,
    protected readonly helperService: HelperService,
    protected readonly hotelMappingService: HotelMappingService,
  ) {}

  async search(req: SearchByRegionDto, agentId: number): Promise<any> {
    const providerCres: HotelProvider[] = await this.redisService.cachedExecute(
      {
        key: `${REDIS_KEY.PROVIDER.HOTEL}:${DEFAULT_HOTEL_PROVIDER_ID}`,
        ttl: REDIS_EXPIRED['1_WEEKS'],
      },
      () =>
        this.entityManager.query(
          `SELECT * from supplier where id = ${DEFAULT_HOTEL_PROVIDER_ID}`,
        ),
    );
    const provider = providerCres[0];
    const mappings = this.hotelMappingService.findSupplierHotelsFromRegions(
      req,
      provider.code,
    );

    return mappings;
  }

  makeRequest(req: SearchByRegionDto, provider: HotelProvider) {}
}
