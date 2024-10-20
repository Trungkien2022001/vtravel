import { RedisService } from 'src/core';
import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { FLIGHT_PROVIDERS } from 'src/shared/constants';
import { ModuleRef } from '@nestjs/core';
import { AmadeusSearchService } from '../processors/amadeus/search.service';
import { SabreSearchService } from '../processors/sabre/search.service';

@Injectable()
export class AvailableService {
  constructor(
    protected readonly entityManager: EntityManager,
    protected readonly redisService: RedisService,
    private readonly moduleRef: ModuleRef,
  ) {}

  async search(body: any, agentId: number) {
    const providerName = FLIGHT_PROVIDERS.DEFAULT;
    const processor = await this.getProcessorFactory(providerName);

    return processor.search(body, agentId);
  }

  /**
   * Dynamically resolve the appropriate processor service based on the configured provider
   */
  async getProcessorFactory(providerName: string): Promise<any> {
    let processor;
    switch (providerName) {
      case FLIGHT_PROVIDERS.AMADEUS:
        processor = await this.moduleRef.get(AmadeusSearchService, {
          strict: false,
        });
        break;

      case FLIGHT_PROVIDERS.SABRE:
        processor = await this.moduleRef.get(SabreSearchService, {
          strict: false,
        });
        break;

      default:
        throw new Error(
          `Processor service not found for provider: ${providerName}`,
        );
    }

    return processor;
  }
}
