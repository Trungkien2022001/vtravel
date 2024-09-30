import { Module } from '@nestjs/common';
import { ElasticsearchModule, RedisModule } from 'src/core';
import { TourSearchController } from './tour-search.controller';
import { TourSearchbyRegionService, TourSearchService } from './services';
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
    DataCenterModule,
  ],
  controllers: [TourSearchController],
  providers: [TourSearchService, UserService, TourSearchbyRegionService],
  exports: [TourSearchService],
})
export class TourSearchModule {}
