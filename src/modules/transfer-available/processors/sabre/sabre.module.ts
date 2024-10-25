import { Module } from '@nestjs/common';
import { SabreSearchService } from './search.service';

@Module({
  imports: [],
  providers: [SabreSearchService],
  exports: [],
})
export class SabreModule {}
