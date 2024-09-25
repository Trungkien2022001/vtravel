import { Inject, Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService as EsService } from '@nestjs/elasticsearch';
import { TElasticsearchDocumentType } from 'src/shared/types';
import * as _ from 'lodash';

@Injectable()
export class ElasticSearchService {
  constructor(
    @Inject(EsService)
    private readonly elasticsearchService: EsService,
  ) {}

  async createDocument(index: TElasticsearchDocumentType, body: any) {
    return await this.elasticsearchService.index(
      {
        index,
        body,
      },
      {
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'Content-Type': 'application/json',
          accept: '*/*',
        },
      },
    );
  }
  async bulk(index: TElasticsearchDocumentType, data: any) {
    const cnk = _.chunk(data, 50);
    Logger.log(`Total record: ${data.lLength}, Total chunk: ${cnk.length}`);
    for (let idx = 0; idx < cnk.length; idx++) {
      const list = cnk[idx];
      try {
        await Promise.all(
          list.map(async (hotel) => {
            try {
              await this.createDocument(index, hotel);
            } catch (e) {
              Logger.error(e);
            }
          }),
        );
      } catch (error) {
        Logger.error(error);
      }
      Logger.log(idx);
    }
  }
}
