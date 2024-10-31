import { ProducerService, RedisService } from 'src/core';
import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { FLIGHT_PROVIDERS, KAFKA_TOPIC } from 'src/shared/constants';
import { ModuleRef } from '@nestjs/core';
import { AmadeusSearchService } from '../processors/amadeus/search.service';
import { SabreSearchService } from '../processors/sabre/search.service';

@Injectable()
export class AvailableService {
  constructor(
    protected readonly entityManager: EntityManager,
    protected readonly redisService: RedisService,
    private readonly moduleRef: ModuleRef,
    private readonly producerService: ProducerService,
  ) {}

  async search(body: any, agentId: number) {
    const providerName = FLIGHT_PROVIDERS.DEFAULT;
    // const processor = await this.getProcessorFactory(providerName);
    this.producerService.sendTestMessage({
      providerName,
      body,
      agentId,
    });

    // return processor.search(body, agentId);
  }
}
