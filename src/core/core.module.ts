import { Global, Module, type Provider } from '@nestjs/common';
import { ApiConfigService } from './config/api-config.service';
import { RedisModule } from './cache/redis/redis.module';
import { DatabaseModule } from './database/database.module';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from './elasticsearch/elasticsearch.module';

const providers: Provider[] = [ApiConfigService, ConfigService];

@Global()
@Module({
  providers,
  imports: [DatabaseModule, RedisModule, ElasticsearchModule],
  exports: [...providers],
})
export class CoreModule {}
