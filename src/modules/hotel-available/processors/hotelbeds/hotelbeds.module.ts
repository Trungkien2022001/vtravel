import { Module } from '@nestjs/common';
import { HotelbedsSearchService } from './search.service';

@Module({
  imports: [],
  providers: [HotelbedsSearchService],
  exports: [],
})
export class HotelbedsModule {}
