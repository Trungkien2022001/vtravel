import { Inject, Injectable } from '@nestjs/common';
import { ElasticsearchService as EsService } from '@nestjs/elasticsearch';

@Injectable()
export class ElasticSearchService {
  constructor(
    @Inject(EsService)
    private readonly elasticsearchService: EsService,
  ) {}
}
