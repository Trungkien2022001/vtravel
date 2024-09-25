import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AgentEntity } from 'src/core/database/entities';
import { EntityManager } from 'typeorm';
import { RedisService } from 'src/core';

@Injectable()
export class DevSupportService {
  constructor(
    @InjectRepository(AgentEntity)
    private readonly entityManager: EntityManager,
    private readonly redisService: RedisService,
  ) {}
}
