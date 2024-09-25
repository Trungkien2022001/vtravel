import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import {
  UnexpectedExceptionFilter,
  AppDataExceptionFilter,
  AppExceptionFilter,
  AppMetatadaExceptionFilter,
  ValidationExceptionFilter,
} from 'src/core/filters';
import { AuthModule } from 'src/modules/auth-agent/auth.module';
import { CoreModule } from 'src/core/core.module';
import { AuthAdminModule } from 'src/modules/auth-admin/auth-admin.module';
import { UserAdminModule } from 'src/modules/user-admin/user-admin.module';
import { UserModule } from 'src/modules/user/agent.module';
import { SearchModule } from 'src/modules/search/search.module';
import { DevSupportModule } from 'src/modules/dev-support/dev-support.module';

@Module({
  imports: [
    CoreModule,
    SearchModule,
    AuthModule,
    AuthAdminModule,
    UserAdminModule,
    UserModule,
    DevSupportModule,
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
