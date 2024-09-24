import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './service/seach.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentEntity, HotelEntity } from 'src/core/database/entities';
import { RedisModule } from 'src/core';
import { AuthModule } from '../auth-agent/auth.module';
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
  ],
  controllers: [SearchController],
  providers: [
    SearchService,
    SearchByRegionService,
    SearchByAirportCodeService,
    SearchByHotelIdsService,
  ],
  exports: [],
})
export class SearchModule {}
