import { DestinationRegionMappingRepository } from './../database/repositories/destination-region-mapping.repository';
import { AirportRepository } from './../database/repositories/airport.repository';
import { RedisService } from './../cache/redis/redis.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { TSearchType } from 'src/shared/types';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AirportEntity,
  DestinationRegionMappingEntity,
} from '../database/entities';
import {
  IATA_AIPORT_CODE_LENGTH,
  REDIS_EXPIRED,
  REDIS_KEY,
  SEARCH_ERROR,
} from 'src/shared/constants';
import { AppError } from 'src/common';

@Injectable()
export class RegionMappingService {
  constructor(
    public configService: ConfigService,
    public redisService: RedisService,
    @InjectRepository(AirportEntity)
    public airportRepository: AirportRepository,
    @InjectRepository(DestinationRegionMappingEntity)
    public destinationRegionMappingRepository: DestinationRegionMappingRepository,
  ) {}

  async getParentRegionId(
    value: string | number | string[],
    type: TSearchType,
  ) {
    let regionId: string;
    switch (type) {
      case 'SEARCH_BY_REGION':
        regionId = value as string;
        break;

      case 'SEARCH_BY_ID':
        regionId = crypto
          .createHash('sha256')
          .update(JSON.stringify(value))
          .digest('base64');
        break;

      case 'SEARCH_BY_AIRPORT_CODE':
        regionId = await this.getRegionFromDestination(value as string);
        break;

      default:
        break;
    }

    return regionId;
  }

  async getRegionFromDestination(airportCode: string): Promise<string> {
    const fn: Promise<any> =
      airportCode.length === IATA_AIPORT_CODE_LENGTH
        ? this.airportRepository.findOne({
            where: {
              airportCode,
            },
          })
        : this.destinationRegionMappingRepository.findOne({
            where: {
              code: airportCode,
            },
          });
    const region = await this.redisService.cachedExecute(
      {
        key: `${REDIS_KEY.DESTINATION_TO_REGION}:${airportCode}`,
        ttl: REDIS_EXPIRED['1_WEEKS'],
      },
      () => fn,
    );

    if (!region) {
      throw new AppError(SEARCH_ERROR.INVALID_OR_UNSUPPORTED_AIRPORT_CODE);
    }

    return region.region_id;
  }
}
