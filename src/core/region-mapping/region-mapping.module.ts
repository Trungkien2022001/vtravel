import { Module, Provider } from '@nestjs/common';
import { RegionMappingService } from './region-mapping.service';
import { RedisModule } from '../cache/redis';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AirportEntity,
  DestinationRegionMappingEntity,
} from '../database/entities';
const providers: Provider[] = [RegionMappingService];
@Module({
  imports: [
    RedisModule,
    TypeOrmModule.forFeature([AirportEntity, DestinationRegionMappingEntity]),
  ],
  providers,
  exports: [...providers],
})
export class RegionMappingModule {}
