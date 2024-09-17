import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import {
  UnexpectedExceptionFilter,
  AppDataExceptionFilter,
  AppExceptionFilter,
  AppMetatadaExceptionFilter,
  ValidationExceptionFilter,
} from 'src/core/filters';
import { AuthModule } from 'src/modules/auth/auth.module';
import { CoreModule } from 'src/core/core.module';

@Module({
  imports: [CoreModule, AuthModule],
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
