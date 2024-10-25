import { Module } from '@nestjs/common';
import { AmadeusSearchService } from './search.service';
import { HelperService } from './helper.service';
import { RedisModule } from 'src/core';
import { HttpModule } from '@nestjs/axios';
import { CoreModule } from 'src/core/core.module';

@Module({
  imports: [RedisModule, HttpModule, CoreModule],
  providers: [AmadeusSearchService, HelperService],
  exports: [],
})
export class AmadeusModule {}
