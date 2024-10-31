import { Injectable, Logger } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { FlightSearcherService } from 'src/modules/flight-available/service';
import { PRODUCTS } from 'src/shared/constants';

@Injectable()
export class RunnerConsummer {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly flightSearcherService: FlightSearcherService,
  ) {}
  async handler(job) {
    const { product, agentId, body, providerName } = job;
    const searcher = await this.getProcessorFactory(product);
    if (!searcher) {
      Logger.log('Search not found');
    } else {
      await searcher.search(body, providerName, agentId);
    }
  }
  async getProcessorFactory(product: keyof typeof PRODUCTS): Promise<any> {
    let searcher;
    switch (product) {
      case PRODUCTS.FLIGHT:
        searcher = await this.moduleRef.get(FlightSearcherService, {
          strict: false,
        });
        break;

      case PRODUCTS.HOTEL:
      default:
      // throw new Error(
      //   `Processor service not found for processor: ${product}`,
      // );
    }

    return searcher;
  }
}
