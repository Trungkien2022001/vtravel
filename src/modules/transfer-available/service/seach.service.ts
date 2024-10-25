import { RedisService } from 'src/core';
import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { TRANSFER_PROVIDERS } from 'src/shared/constants';
import { TransferzSearchService } from '../processors/transferz/search.service';
import { HotelBedsSearchService } from '../processors/hotelbeds/search.service';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class AvailableService {
  constructor(
    protected readonly entityManager: EntityManager,
    protected readonly redisService: RedisService,
    private readonly moduleRef: ModuleRef,
  ) {}

  async search(body: any, agentId: number) {
    const providerName = TRANSFER_PROVIDERS.DEFAULT;
    const processor = await this.getProcessorFactory(providerName);

    return processor.search(body, agentId);
  }

  /**
   * Dynamically resolve the appropriate processor service based on the configured provider
   */
  async getProcessorFactory(providerName: string): Promise<any> {
    let processor;
    switch (providerName) {
      case TRANSFER_PROVIDERS.HOTELBEDS:
        processor = await this.moduleRef.get(HotelBedsSearchService, {
          strict: false,
        });
        break;

      case TRANSFER_PROVIDERS.TRANSFERZ:
        processor = await this.moduleRef.get(TransferzSearchService, {
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
