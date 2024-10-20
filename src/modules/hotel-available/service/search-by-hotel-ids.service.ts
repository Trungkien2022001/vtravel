import { RedisService } from 'src/core';
import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ValidateHotelSearchRequest } from 'src/common';
import { SearchByHotelIdsDto } from '../dto';
import { AvailableService } from './seach.service';

@Injectable()
export class SearchByHotelIdsService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly redisService: RedisService,
    private readonly availableService: AvailableService,
  ) {}

  async search(body: SearchByHotelIdsDto) {
    ValidateHotelSearchRequest(body);
    // const { hotel_ids: hotelIds } = body;
    const rooms = await this.availableService.findRoomsIdsFromHotelIds(body);
    const rates = await this.availableService.findRateDetailsByRoomsIds(rooms);

    return rates;
  }
}
