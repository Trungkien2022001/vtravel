import { RedisService } from 'src/core';
import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ValidateSearchRequest } from 'src/common';
import { SearchByHotelIdsDto } from '../dto';

@Injectable()
export class SearchByHotelIdsService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly redisService: RedisService,
  ) {}

  async search(body: SearchByHotelIdsDto) {
    ValidateSearchRequest(body);
    const { hotel_ids: hotelIds } = body;

    return hotelIds;
  }
}
