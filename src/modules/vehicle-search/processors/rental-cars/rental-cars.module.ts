import { Module } from '@nestjs/common';
import { RentalCarsSearchService } from './search.service';
import { HelperService } from './helper.service';
import { RedisModule } from 'src/core';
import { HttpModule } from '@nestjs/axios';
import { CoreModule } from 'src/core/core.module';

@Module({
  imports: [RedisModule, HttpModule, CoreModule],
  providers: [RentalCarsSearchService, HelperService],
  exports: [],
})
export class RentalCarsModule {}
