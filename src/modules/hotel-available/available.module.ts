import { Module } from '@nestjs/common';
import { AvailableController } from './available.controller';
import { AvailableService } from './service/seach.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentEntity, HotelEntity } from 'src/core/database/entities';
import { HotelMappingModule, RedisModule, RegionMappingModule } from 'src/core';
import { AuthModule } from '../agent-auth/auth.module';
import { UserModule } from '../user/agent.module';
import {
  SearchByAirportCodeService,
  SearchByHotelIdsService,
  SearchByRegionService,
} from './service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AgentEntity, HotelEntity]),
    RedisModule,
    AuthModule,
    UserModule,
    RegionMappingModule,
    HotelMappingModule,
  ],
  controllers: [AvailableController],
  providers: [
    AvailableService,
    SearchByRegionService,
    SearchByAirportCodeService,
    SearchByHotelIdsService,
  ],
  exports: [AvailableService],
})
export class HotelAvailableModule {}
