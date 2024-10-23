import { EntityManager } from 'typeorm';
import { ElasticSearchService, RedisService } from 'src/core';
import { Injectable } from '@nestjs/common';
import { SearchGuilderDto } from '../dtos';

@Injectable()
export class GuilderService {
  constructor(
    private readonly elasticSearchService: ElasticSearchService,
    private readonly redisService: RedisService,
    private readonly entityManager: EntityManager,
  ) {}

  async getSearchGuilder(req: SearchGuilderDto) {
    return req;
  }
}
