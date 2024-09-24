import { RedisService } from 'src/core';
import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SearchService {
  constructor(
    protected readonly entityManager: EntityManager,
    protected readonly redisService: RedisService,
  ) {}
}
