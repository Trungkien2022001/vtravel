import { Module } from '@nestjs/common';
import { AmadeusSearchService } from './search.service';
import { HelperService } from './helper.service';
import { RedisModule } from 'src/core';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [RedisModule, HttpModule],
  providers: [AmadeusSearchService, HelperService],
  exports: [],
})
export class AmadeusModule {}
