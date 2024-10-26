import { Module } from '@nestjs/common';
import { ElasticsearchModule, RedisModule } from 'src/core';
import { VehicleSearchController } from './search.controller';
import { VehicleSearchbyRegionService, VehicleSearchService } from './services';
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
import { CurrencyModule } from '../currency/currency.module';
import { VehicleSearchbyAirportCodeService } from './services/search-by-airport-code.service';
import { VehicleSearchbyIdService } from './services/search-by-id.service';
import { VehicleProviderSearchService } from './services/search-provider.sevice';
import { ProcessorsModules } from './processors';

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
    CurrencyModule,
    ...Object.values(ProcessorsModules),
  ],
  controllers: [VehicleSearchController],
  providers: [
    VehicleSearchService,
    UserService,
    VehicleSearchbyRegionService,
    VehicleSearchbyAirportCodeService,
    VehicleSearchbyIdService,
    VehicleProviderSearchService,
  ],
  exports: [VehicleSearchService],
})
export class VehicleSearchModule {}
