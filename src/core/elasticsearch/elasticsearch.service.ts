/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService as EsService } from '@nestjs/elasticsearch';
import { TElasticsearchDocumentType } from 'src/shared/types';
import * as _ from 'lodash';
import {
  ELASTICSEARCH_DOCUMENT,
  MAXIMUM_ES_SUGGESTED_HOTEL,
  MAXIMUM_HOTEL_RETUREND,
  MAXIMUM_ES_SUGGESTED_REGION,
  MAXIMUM_TOUR_RETUREND,
  MAXIMUM_VEHICLE_RETUREND,
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
    Logger.log(`Total record: ${data.length}, Total chunk: ${cnk.length}`);
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

  async getToursInfo(tourIds: string[]) {
    const rows = await this.elasticsearchService.search({
      index: ELASTICSEARCH_DOCUMENT.TOUR_INFO,
      size: MAXIMUM_TOUR_RETUREND,
      body: {
        _source: [
          'id',
          'name',
          'descriptions',
          'duration',
          'passport_require',
          'description',
          'images',
        ],
        query: {
          bool: {
            filter: [
              {
                terms: {
                  'id.keyword': tourIds,
                },
              },
            ],
          },
        },
      },
    });

    return rows.hits.hits.map((h) => h._source);
  }

  async getVehicleInfo(vehicleId: string): Promise<any> {
    const rows = await this.elasticsearchService.search({
      index: ELASTICSEARCH_DOCUMENT.VEHICLE_INFO,
      body: {
        query: {
          bool: {
            filter: {
              term: {
                id: vehicleId,
              },
            },
          },
        },
      },
    });

    return rows.hits.hits[0]._source;
  }

  async getVehiclesInfo(vehicleIds: string[]) {
    const hotels = await this.elasticsearchService.search({
      index: ELASTICSEARCH_DOCUMENT.VEHICLE_INFO,
      size: MAXIMUM_VEHICLE_RETUREND,
      body: {
        _source: [
          'id',
          'name',
          'type',
          'country_code',
          'city_code',
          'region_id',
          'description',
          'currency',
          'images',
        ],
        query: {
          bool: {
            filter: {
              terms: {
                id: vehicleIds,
              },
            },
          },
        },
      },
    });

    return hotels.hits.hits.map((h) => h._source);
  }
  async getTourInfo(tourId: string): Promise<any> {
    const result = await this.elasticsearchService.search({
      index: ELASTICSEARCH_DOCUMENT.TOUR_INFO,
      body: {
        query: {
          bool: {
            filter: [
              {
                term: {
                  'id.keyword': tourId,
                },
              },
            ],
          },
        },
      },
    });

    return result.hits.hits[0]?._source || null;
  }

  async getHotelsFromName(text: string) {
    const rows = await this.elasticsearchService.search({
      index: ELASTICSEARCH_DOCUMENT.HOTEL_INFO,
      size: MAXIMUM_ES_SUGGESTED_HOTEL,
      body: {
        _source: ['hotel_id', 'name', 'address', 'country_code'],
        query: {
          match_phrase: {
            name: text,
          },
        },
      },
    });

    return rows.hits.hits.map((h) => h._source);
  }
  async getRegionsFromName(text: string) {
    const rows = await this.elasticsearchService.search({
      index: ELASTICSEARCH_DOCUMENT.REGION,
      size: MAXIMUM_ES_SUGGESTED_REGION,
      body: {
        _source: [
          'region_id',
          'region_name',
          'region_name_full',
          'country',
          'region_type',
        ],
        query: {
          bool: {
            must: {
              match_phrase: {
                region_name: text,
              },
            },
            must_not: {
              terms: {
                region_type: [
                  'point_of_interest',
                  'neighborhood',
                  'metro_station',
                  'train_station',
                ],
              },
            },
          },
        },
      },
    });

    return rows.hits.hits.map((h) => h._source);
  }

  async getSmartRegionsFromName(text: string) {
    const rows = await this.elasticsearchService.search({
      index: ELASTICSEARCH_DOCUMENT.REGION,
      size: MAXIMUM_ES_SUGGESTED_REGION,
      body: {
        _source: [
          'region_id',
          'region_name',
          'region_name_full',
          'country',
          'region_type',
        ],
        query: {
          match: {
            region_name: {
              query: text,
              fuzziness: 'AUTO',
            },
          },
        },
      },
    });

    return rows.hits.hits.map((h) => h._source);
  }
}
