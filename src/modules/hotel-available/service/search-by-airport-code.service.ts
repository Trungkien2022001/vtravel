import { AvailableService } from './seach.service';
import {
  HotelMappingService,
  RedisService,
  RegionMappingService,
} from 'src/core';
import { EntityManager } from 'typeorm';
import { SearchByAirportCodeDto } from '../dto/search-by-airport-code.dto';
import { Injectable } from '@nestjs/common';
import { ValidateHotelSearchRequest } from 'src/common';
import { REDIS_EXPIRED, REDIS_KEY } from 'src/shared/constants';
import { SearchByRegionDto } from '../dto';

@Injectable()
export class SearchByAirportCodeService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly redisService: RedisService,
    private readonly availableService: AvailableService,
    private readonly regionMappingService: RegionMappingService,
    private readonly hotelMappingService: HotelMappingService,
  ) {}

  async search(body: SearchByAirportCodeDto) {
    ValidateHotelSearchRequest(body);
    const { airport_code: airportCode } = body;
    const regionId =
      await this.regionMappingService.getRegionFromDestination(airportCode);

    const hotels = await this.availableService.findActiveHotelIds({
      ...body,
      // eslint-disable-next-line camelcase
      region_id: regionId,
    });

    return hotels;
  }

  async getHotelByAirportCode(airportCode: string): Promise<number[]> {
    const hotels = await this.entityManager.query(
      `
      SELECT 
        hotel_id
      FROM public."hotel"
      WHERE airport_code = $1
        AND is_deleted = false`,
      [airportCode],
    );

    return hotels.map((hotel) => hotel.hotel_id) as number[];
  }
}
