import { RedisService } from 'src/core';
import { EntityManager } from 'typeorm';
import { SearchByAirportCodeDto } from './dto/search-by-airport-code.dto';
import { Injectable } from '@nestjs/common';
import { ValidateSearchRequest } from 'src/common';
import { REDIS_EXPIRED, REDIS_KEY } from 'src/shared/constants';

@Injectable()
export class SearchService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly redisService: RedisService,
  ) {}

  async searchByAirportCode(body: SearchByAirportCodeDto) {
    ValidateSearchRequest(body);
    const { airport_code: airportCode } = body;
    const hotelIds = await this.redisService.cachedExecute(
      {
        key: `${REDIS_KEY.HOTEL_BY_AIRPORT_CODE}:${airportCode}`,
        ttl: REDIS_EXPIRED['1_WEEKS'],
      },
      this.getHotelByAirportCode(airportCode),
    );

    return hotelIds;
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
