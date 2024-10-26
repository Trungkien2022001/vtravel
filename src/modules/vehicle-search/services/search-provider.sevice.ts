import { CurrencyService } from '../../currency/services/currency.service';
/* eslint-disable camelcase */
import { EntityManager } from 'typeorm';
import { ElasticSearchService, RedisService } from 'src/core';
import { Injectable } from '@nestjs/common';
import { DataCenterService } from 'src/modules/data-center';
import * as _ from 'lodash';
import { VehicleSearchByRegionDto } from '../dto';
import * as moment from 'moment';
import {
  DEFAULT_DATE_FORMAT,
  APPLICATION_STARTED_DATE,
  TRANSFER_PROVIDERS,
  VEHICLE_PROVIDERS,
} from 'src/shared/constants';
import { ModuleRef } from '@nestjs/core';
import { RentalCarsSearchService } from '../processors/rental-cars/search.service';

@Injectable()
export class VehicleProviderSearchService {
  constructor(
    private readonly elasticSearchService: ElasticSearchService,
    private readonly redisService: RedisService,
    private readonly currencyService: CurrencyService,
    private readonly entityManager: EntityManager,
    private readonly dataCenterService: DataCenterService,
    private readonly moduleRef: ModuleRef,
  ) {}

  async search(body: any, agentId: number) {
    const providerName = VEHICLE_PROVIDERS.DEFAULT;
    const processor = await this.getProcessorFactory(providerName);

    return processor.search(body, agentId);
  }

  /**
   * Dynamically resolve the appropriate processor service based on the configured provider
   */
  async getProcessorFactory(providerName: string): Promise<any> {
    let processor;
    switch (providerName) {
      case VEHICLE_PROVIDERS.CAR_RENTALS:
        processor = await this.moduleRef.get(RentalCarsSearchService, {
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
