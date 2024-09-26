/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService as EsService } from '@nestjs/elasticsearch';
import { TElasticsearchDocumentType } from 'src/shared/types';
import * as _ from 'lodash';
import {
  ELASTICSEARCH_DOCUMENT,
  MAXIMUM_HOTEL_RETUREND,
} from 'src/shared/constants';

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

  async findHotelByHotelIds(hotelIds: string[]) {
    const hotels = await this.elasticsearchService.search({
      index: ELASTICSEARCH_DOCUMENT.HOTEL_INFO,
      size: MAXIMUM_HOTEL_RETUREND,
      body: {
        _source: [
          'hotel_id',
          'name',
          'address',
          'country_code',
          'city_code',
          'destrict_code',
          'street_code',
          'currency',
          'rating',
          'latitude',
          'longitude',
          'rank',
          // 'amenities',
          'images',
        ],
        query: {
          bool: {
            filter: {
              terms: {
                hotel_id: hotelIds,
              },
            },
          },
        },
      },
    });

    return hotels.hits.hits.map((h) => h._source);
  }
  async getHotelInfo(hotelId: string) {
    const rows = await this.elasticsearchService.search({
      index: ELASTICSEARCH_DOCUMENT.HOTEL_INFO,
      size: MAXIMUM_HOTEL_RETUREND,
      body: {
        query: {
          bool: {
            filter: {
              term: {
                hotel_id: hotelId,
              },
            },
          },
        },
      },
    });

    return rows.hits.hits[0]._source;
  }

  async getRoomsInfo(roomIds: string[]) {
    const rows = await this.elasticsearchService.search({
      index: ELASTICSEARCH_DOCUMENT.ROOM_INFO,
      size: MAXIMUM_HOTEL_RETUREND,
      body: {
        query: {
          bool: {
            filter: {
              terms: {
                room_id: roomIds,
              },
            },
          },
        },
      },
    });

    return rows.hits.hits.map((h) => h._source);
  }
}
