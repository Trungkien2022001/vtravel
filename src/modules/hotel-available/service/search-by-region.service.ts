import { AvailableService } from './seach.service';
import {
  RedisService,
  RegionMappingService,
  HotelMappingService,
} from 'src/core';
import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ValidateHotelSearchRequest } from 'src/common';
// import { REDIS_EXPIRED, REDIS_KEY } from 'src/shared/constants';
import { SearchByRegionDto } from '../dto';

@Injectable()
export class SearchByRegionService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly redisService: RedisService,
    private readonly availableService: AvailableService,
    private readonly regionMappingService: RegionMappingService,
    private readonly hotelMappingService: HotelMappingService,
  ) {}

  async search(body: SearchByRegionDto) {
    ValidateHotelSearchRequest(body);
    const hotels = await this.availableService.findHotelAvailable(body);

    return hotels;
  }
}
