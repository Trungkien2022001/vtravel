import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import {
  UnexpectedExceptionFilter,
  AppDataExceptionFilter,
  AppExceptionFilter,
  AppMetatadaExceptionFilter,
  ValidationExceptionFilter,
} from 'src/core/filters';
import { AuthModule } from 'src/modules/agent-auth/auth.module';
import { CoreModule } from 'src/core/core.module';
import { AuthAdminModule } from 'src/modules/admin-auth/auth-admin.module';
import { UserAdminModule } from 'src/modules/user-admin/user-admin.module';
import { UserModule } from 'src/modules/user/agent.module';
import { HotelAvailableModule } from 'src/modules/hotel-available/available.module';
import { DevSupportModule } from 'src/modules/dev-support/dev-support.module';
import { HotelSearchModule } from 'src/modules/hotel-search/hotel-search.module';
import { DataCenterModule } from 'src/modules/data-center/data-center.module';
import { HotelDetailModule } from 'src/modules/hotel-detail/detail.module';
import { HotelPrebookModule } from 'src/modules/hotel-prebook/prebook.module';
import { TourSearchModule } from 'src/modules/tour-search/tour-search.module';
import { CurrencyModule } from 'src/modules/currency/currency.module';
import { TourDetailModule } from 'src/modules/tour-detail/detail.module';
import { VehicleSearchModule } from 'src/modules/vehicle-search/search.module';
import { VehicleDetailModule } from 'src/modules/vehicle-detail/detail.module';

@Module({
  imports: [
    CoreModule,
    VehicleDetailModule,
    VehicleSearchModule,
    TourDetailModule,
    TourSearchModule,
    HotelSearchModule,
    HotelDetailModule,
    HotelPrebookModule,
    HotelAvailableModule,
    DataCenterModule,
    AuthModule,
    DevSupportModule,
    AuthAdminModule,
    UserAdminModule,
    UserModule,
    CurrencyModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: UnexpectedExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: AppExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ValidationExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: AppDataExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: AppMetatadaExceptionFilter,
    },
  ],
})
export class AppModule {}
