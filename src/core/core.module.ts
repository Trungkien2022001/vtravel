import { Global, Module, type Provider } from '@nestjs/common';
import { ApiConfigService } from './config/api-config.service';
import { RedisModule } from './cache/redis/redis.module';
import { DatabaseModule } from './database/database.module';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from './elasticsearch/elasticsearch.module';
import { RegionMappingModule, RegionMappingService } from './region-mapping';
import { HotelMappingModule, HotelMappingService } from './hotel-mapping';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AirportEntity,
  DestinationRegionMappingEntity,
} from './database/entities';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventEmitterHandlerModule } from './event-emitter';
import { ProviderLogger } from 'src/common/logger/provider.logger';

const providers: Provider[] = [
  ApiConfigService,
  ConfigService,
  RegionMappingService,
  HotelMappingService,
  ProviderLogger,
];

@Global()
@Module({
  providers,
  imports: [
    EventEmitterModule.forRoot(),
    TypeOrmModule.forFeature([AirportEntity, DestinationRegionMappingEntity]),
    DatabaseModule,
    RedisModule,
    ElasticsearchModule,
    RegionMappingModule,
    HotelMappingModule,
    EventEmitterHandlerModule,
  ],
  exports: [...providers],
})
export class CoreModule {}
