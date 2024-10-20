import { HelperService } from './helper.service';
import { Injectable } from '@nestjs/common';
import { FlightSearchDto } from '../../dto';
import { EntityManager } from 'typeorm';
import { RedisService } from 'src/core';
import {
  DEFAULT_FLIGHT_PROVIDER_ID,
  FLIGHT_ACTIONS,
  REDIS_EXPIRED,
  REDIS_KEY,
} from 'src/shared/constants';
import { FlightProvider } from 'src/shared';
@Injectable()
export class AmadeusSearchService {
  constructor(
    protected readonly entityManager: EntityManager,
    protected readonly redisService: RedisService,
    protected readonly helperService: HelperService,
  ) {}

  async search(body: FlightSearchDto): Promise<any> {
    const providerCres: FlightProvider[] =
      await this.redisService.cachedExecute(
        {
          key: `${REDIS_KEY.PROVIDER.FLIGHT}:${DEFAULT_FLIGHT_PROVIDER_ID}`,
          ttl: REDIS_EXPIRED['1_WEEKS'],
        },
        () =>
          this.entityManager.query(
            `SELECT * from supplier where id = ${DEFAULT_FLIGHT_PROVIDER_ID}`,
          ),
      );
    const baseSoap = await this.helperService.baseSoap(
      providerCres[0],
      FLIGHT_ACTIONS.Fare_MasterPricerTravelBoardSearch,
    );

    return baseSoap;
  }
}
