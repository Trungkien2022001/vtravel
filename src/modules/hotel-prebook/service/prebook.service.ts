import { RedisService } from 'src/core';
import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HotelPrebookService {
  constructor(
    protected readonly entityManager: EntityManager,
    protected readonly redisService: RedisService,
  ) {}

  async get() {}
}