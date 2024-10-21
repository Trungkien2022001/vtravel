import {
  HotelMappingService,
  RedisService,
  RegionMappingService,
} from 'src/core';
import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { SearchByRegionDto } from '../dto';
import { ValidateHotelSearchRequest } from 'src/common';
import * as _ from 'lodash';
import { AvailableService } from './seach.service';
import { HOTEL_PROVIDERS } from 'src/shared/constants';
import { ModuleRef } from '@nestjs/core';
import { HotelbedsSearchService } from '../processors/hotelbeds/search.service';
import { JuniperSearchService } from '../processors/juniper/search.service';

@Injectable()
export class SearchProviderService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly redisService: RedisService,
    private readonly availableService: AvailableService,
    private readonly regionMappingService: RegionMappingService,
    private readonly hotelMappingService: HotelMappingService,
    private readonly moduleRef: ModuleRef,
  ) {}

  async search(body: SearchByRegionDto, agentId: number) {
    ValidateHotelSearchRequest(body);
    const providerName = HOTEL_PROVIDERS.DEFAULT;
    const processor = await this.getProcessorFactory(providerName);

    return processor.search(body, agentId);
  }

  /**
   * Dynamically resolve the appropriate processor service based on the configured provider
   */
  async getProcessorFactory(providerName: string): Promise<any> {
    let processor;
    switch (providerName) {
      case HOTEL_PROVIDERS.JUNIPER:
        processor = await this.moduleRef.get(JuniperSearchService, {
          strict: false,
        });
        break;

      case HOTEL_PROVIDERS.HOTELBEDS:
        processor = await this.moduleRef.get(HotelbedsSearchService, {
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
