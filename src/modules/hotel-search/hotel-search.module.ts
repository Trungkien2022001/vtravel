import { Module } from '@nestjs/common';
import { ElasticsearchModule, RedisModule } from 'src/core';
import { HotelSearchController } from './hotel-search.controller';
import { HotelSearchService } from './services';
import { HotelAvailableModule } from '../hotel-available/available.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AgentEntity,
  AgentResourceEntity,
  RoleEntity,
  UserEntity,
  UserRoleEntity,
} from 'src/core/database/entities';
import { UserService } from '../user/agent.service';
import { DataCenterModule } from '../data-center/data-center.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AgentEntity,
      UserEntity,
      UserRoleEntity,
      RoleEntity,
      AgentResourceEntity,
    ]),
    RedisModule,
    ElasticsearchModule,
    HotelAvailableModule,
    DataCenterModule,
  ],
  controllers: [HotelSearchController],
  providers: [HotelSearchService, UserService],
  exports: [HotelSearchService],
})
export class HotelSearchModule {}
