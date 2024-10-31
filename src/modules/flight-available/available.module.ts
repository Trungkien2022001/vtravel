import { Module } from '@nestjs/common';
import { AvailableController } from './available.controller';
import { AvailableService, FlightSearcherService } from './service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentEntity, HotelEntity } from 'src/core/database/entities';
import {
  HotelMappingModule,
  ProducerModule,
  RedisModule,
  RegionMappingModule,
} from 'src/core';
import { AuthModule } from '../agent-auth/auth.module';
import { UserModule } from '../user/agent.module';
import { ProcessorsModules } from './processors';

@Module({
  imports: [
    TypeOrmModule.forFeature([AgentEntity, HotelEntity]),
    RedisModule,
    AuthModule,
    UserModule,
    RegionMappingModule,
    HotelMappingModule,
    ProducerModule,
    ...Object.values(ProcessorsModules),
  ],
  controllers: [AvailableController],
  providers: [AvailableService, FlightSearcherService],
  exports: [AvailableService, FlightSearcherService],
})
export class FlightSearchModule {}
