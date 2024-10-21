import { Module } from '@nestjs/common';
import { DevSupportController } from './dev-support.controller';
import { UserAdminService } from '../user-admin/user-admin.service';
import { ElasticsearchModule, RedisService } from 'src/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AgentEntity,
  HotelRateCrawlerEntity,
  RoleEntity,
  RoomRateEntity,
  UserEntity,
  UserRoleEntity,
} from 'src/core/database/entities';
import { CrawlerService, DevSupportService } from './services';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    ElasticsearchModule,
    TypeOrmModule.forFeature([
      AgentEntity,
      UserEntity,
      UserRoleEntity,
      RoleEntity,
      RoomRateEntity,
      HotelRateCrawlerEntity,
    ]),
  ],
  controllers: [DevSupportController],
  providers: [
    UserAdminService,
    RedisService,
    DevSupportService,
    CrawlerService,
  ],
  exports: [],
})
export class DevSupportModule {}
