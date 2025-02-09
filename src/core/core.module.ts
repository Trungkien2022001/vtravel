import * as dotenv from 'dotenv';
import { Global, Module, type Provider } from '@nestjs/common';
import { ApiConfigService } from './config/api-config.service';
import { RedisModule } from './cache/redis/redis.module';
import { DatabaseModule } from './database/database.module';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from './elasticsearch/elasticsearch.module';
import { RegionMappingModule, RegionMappingService } from './region-mapping';
import { HotelMappingModule, HotelMappingService } from './hotel-mapping';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from '@nestjs/microservices';
import {
  AirportEntity,
  DestinationRegionMappingEntity,
} from './database/entities';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventEmitterHandlerModule } from './event-emitter';
import { ProviderLogger } from 'src/common/logger';
import { kafkaConfig, KafkaProducer, ProducerModule } from './message-queue';
import { KAFKA_SERVICE_NAME } from 'src/shared/constants';

const providers: Provider[] = [
  ApiConfigService,
  ConfigService,
  RegionMappingService,
  HotelMappingService,
  ProviderLogger,
];

const imports = [
  EventEmitterModule.forRoot(),
  TypeOrmModule.forFeature([AirportEntity, DestinationRegionMappingEntity]),
  DatabaseModule,
  RedisModule,
  ElasticsearchModule,
  RegionMappingModule,
  HotelMappingModule,
  EventEmitterHandlerModule,
];

if (dotenv.config().parsed.IS_USE_KAFKA === 'true') {
  imports.push(
    ...[
      ProducerModule,
      ClientsModule.register([
        {
          name: KAFKA_SERVICE_NAME,
          ...kafkaConfig,
        },
      ]),
    ],
  );
  providers.push(KafkaProducer);
}

@Global()
@Module({
  providers,
  imports,
  exports: [...providers],
})
export class CoreModule {}
