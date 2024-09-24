import { RedisService } from 'src/core';
import { EntityManager } from 'typeorm';
import { SearchByAirportCodeDto } from '../dto/search-by-airport-code.dto';
import { Injectable } from '@nestjs/common';
import { ValidateSearchRequest } from 'src/common';
import { REDIS_EXPIRED, REDIS_KEY } from 'src/shared/constants';
import { SearchByRegionDto } from '../dto';

@Injectable()
export class SearchByRegionService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly redisService: RedisService,
  ) {}

  async search(body: SearchByRegionDto) {
    ValidateSearchRequest(body);
    const { region } = body;

    return region;
  }
}
