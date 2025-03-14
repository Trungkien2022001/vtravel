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
    for (let index = 20; index < 100; index++) {
      const hotels = await this.entityManager.query(`
          SELECT * FROM hotel_info where id >= ${index * 10000} and id < ${(index + 1) * 10000}
        `);

      await this.elasticSearchService.bulk('hotel_info', hotels);
    }
  }

  async bulkInsertRegionslElasticseach() {
    const data = await this.entityManager.query(`
      SELECT * FROM region
      `);

    await this.elasticSearchService.bulk('region', data);
  }

  async bulkInsertAirportslElasticseach() {
    const data = await this.entityManager.query(`
      SELECT * FROM airport where region_id is not null
      `);

    await this.elasticSearchService.bulk('airport', data);
  }

  async bulkInsertRoomslElasticseach() {
    for (let index = 0; index < 50; index++) {
      const data = await this.entityManager.query(`
      SELECT * FROM room_info where id >= ${index * 50000} and id < ${(index + 1) * 50000}
      `);

      await this.elasticSearchService.bulk('room_info', data);
    }
  }
  async bulkInsertTourslElasticseach() {
    const data = await this.entityManager.query(`
      SELECT * FROM tour_info
      `);

    await this.elasticSearchService.bulk('tour_info', data);
  }
  async bulkInsertVehicleslElasticseach() {
    const data = await this.entityManager.query(`
      SELECT * FROM vehicle_info
      `);

    await this.elasticSearchService.bulk('vehicle_info', data);
  }
}
