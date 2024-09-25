import { SearchService } from '../../hotel-search/service/seach.service';
import { EntityManager } from 'typeorm';
import { ElasticSearchService, RedisService } from 'src/core';
import { Injectable } from '@nestjs/common';
import { SearchByRegionDto } from 'src/modules/hotel-search/dto';

@Injectable()
export class DataCenterService {
  constructor(
    private readonly elasticSearchService: ElasticSearchService,
    private readonly redisService: RedisService,
    private readonly entityManager: EntityManager,
    private readonly searchService: SearchService,
  ) {}

  async searchByRegion(body: SearchByRegionDto) {
    const hotels = await this.searchService.findActiveHotelIdsFromRegion(body);
    const hotelIds = hotels.map((h) => h.hotel_id);

    return this.elasticSearchService.findHotelByHotelIds(hotelIds);
  }
}
