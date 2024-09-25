import { Module } from '@nestjs/common';
import { ElasticsearchModule, RedisModule } from 'src/core';
import { HotelInfoSearchController } from './hotel-info-search.controller';
import { HotelInfoSearchService } from './services';
import { SearchModule } from '../search/search.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AgentEntity,
  AgentResourceEntity,
  RoleEntity,
  UserEntity,
  UserRoleEntity,
} from 'src/core/database/entities';
import { UserService } from '../user/agent.service';

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
    SearchModule,
  ],
  controllers: [HotelInfoSearchController],
  providers: [HotelInfoSearchService, UserService],
  exports: [HotelInfoSearchService],
})
export class HotelInfoSearchModule {}
