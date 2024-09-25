import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AgentEntity } from 'src/core/database/entities';
import { EntityManager } from 'typeorm';
import { ElasticSearchService, RedisService } from 'src/core';
import { AppError } from 'src/common';
import { ERROR } from 'src/shared/constants';
import * as _ from 'lodash';

@Injectable()
export class DevSupportService {
  constructor(
    @InjectRepository(AgentEntity)
    private readonly entityManager: EntityManager,
    private readonly redisService: RedisService,
    private readonly elasticSearchService: ElasticSearchService,
  ) {}

  async elasticseachEntryPoint() {
    throw new AppError(ERROR.METHOD_NOT_IMPLEMENT_YET);
  }

  async singleInsertHotelElasticsearch(hotelId: string) {
    try {
      const hotels = await this.entityManager.query(`
          SELECT * FROM hotel_info where id = ${hotelId}
        `);
      const result = await this.elasticSearchService.createDocument(
        'hotel_info',
        hotels[0],
      );

      return result;
    } catch (error) {
      Logger.error(error);
    }
  }

  async bulkInsertHotelElasticseach() {
    const hotels = await this.entityManager.query(`
      SELECT * FROM hotel_info
      `);

    await this.elasticSearchService.bulk('hotel_info', hotels);
  }

  async bulkInsertRegionslElasticseach() {
    const data = await this.entityManager.query(`
      SELECT * FROM region
      `);

    await this.elasticSearchService.bulk('region', data);
  }

  async bulkInsertRRoomslElasticseach() {
    const data = await this.entityManager.query(`
      SELECT * FROM room_info
      `);

    await this.elasticSearchService.bulk('room_info', data);
  }
}