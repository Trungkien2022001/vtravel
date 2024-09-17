import { Global, Module, type Provider } from '@nestjs/common';
import { ApiConfigService } from './config/api-config.service';
import { RedisModule } from './cache/redis/redis.module';
import { DatabaseModule } from './database/database.module';
import { ConfigService } from '@nestjs/config';

const providers: Provider[] = [ApiConfigService, ConfigService];

@Global()
@Module({
  providers,
  imports: [DatabaseModule, RedisModule],
  exports: [...providers],
})
export class CoreModule {}
