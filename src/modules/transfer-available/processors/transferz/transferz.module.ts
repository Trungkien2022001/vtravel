import { Module } from '@nestjs/common';
import { TransferzSearchService } from './search.service';

@Module({
  imports: [],
  providers: [TransferzSearchService],
  exports: [],
})
export class TransferzModule {}
