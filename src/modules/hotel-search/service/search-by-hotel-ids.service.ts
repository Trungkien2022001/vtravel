import { RedisService } from 'src/core';
import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ValidateSearchRequest } from 'src/common';
import { SearchByHotelIdsDto } from '../dto';
import { SearchService } from './seach.service';

@Injectable()
export class SearchByHotelIdsService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly redisService: RedisService,
    private readonly searchService: SearchService,
  ) {}

  async search(body: SearchByHotelIdsDto) {
    ValidateSearchRequest(body);
    // const { hotel_ids: hotelIds } = body;
    const rooms = await this.searchService.findRoomsIdsFromHotelIds(body);
    const rates = await this.searchService.findRateDetailsByRoomsIds(rooms);

    return rates;
  }
}
