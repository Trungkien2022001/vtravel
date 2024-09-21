import { Module } from '@nestjs/common';
import { ElasticsearchModule as EsModule } from '@nestjs/elasticsearch';
import { ApiConfigModule, ApiConfigService } from '../config';
import { ElasticSearchService } from './elasticsearch.service';

@Module({
  imports: [
    ApiConfigModule,
    EsModule.registerAsync({
      imports: [ApiConfigModule],
      useFactory: async (configService: ApiConfigService) => ({
        node: configService.get('ELASTICSEARCH_NODE'),
      }),
      inject: [ApiConfigService],
    }),
  ],
  providers: [ElasticSearchService],
  exports: [ElasticSearchService],
})
export class ElasticsearchModule {}
