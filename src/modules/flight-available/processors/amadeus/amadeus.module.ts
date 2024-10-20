import { Module } from '@nestjs/common';
import { AmadeusSearchService } from './search.service';
import { HelperService } from './helper.service';
import { RedisModule } from 'src/core';

@Module({
  imports: [RedisModule],
  providers: [AmadeusSearchService, HelperService],
  exports: [],
})
export class AmadeusModule {}
