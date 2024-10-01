import { RedisService, ElasticSearchService } from 'src/core';
import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { VehicleDetailDto } from '../dto';
import {
  APPLICATION_STARTED_DATE,
  DEFAULT_DATE_FORMAT,
  REDIS_EXPIRED,
  REDIS_KEY,
  SEARCH_ERROR,
} from 'src/shared/constants';

import * as _ from 'lodash';
import * as moment from 'moment';
import { buildVehicleDetailCacheKey, AppError } from 'src/common';

@Injectable()
export class VehicleDetailService {
  constructor(
    protected readonly entityManager: EntityManager,
    protected readonly redisService: RedisService,
    private readonly elasticSearchService: ElasticSearchService,
  ) {}

  async getVehicleDetail(body: VehicleDetailDto) {
    await this.checkAvailableTour(body);
    const tourRates = await this.findAllRate(body);
    const tourInfo = await this.elasticSearchService.getTourInfo(body.tour_id);

    return {
      ...tourInfo,
      rate: tourRates,
    };
  }

  async checkAvailableTour(body: VehicleDetailDto) {
    let additionalConditional = '';
    const numOfPax = body.adult + body.children + body.infant;

    const diffDays = moment(body.checkin, DEFAULT_DATE_FORMAT).diff(
      moment(APPLICATION_STARTED_DATE),
      'days',
    );
    for (let index = 0; index <= body.duration; index++) {
      additionalConditional += ` and  tc2.availability[${diffDays + index}] > 0 \n`;
    }

    const avaiTours = await this.entityManager.query(`
      select 
        tc2.tour_id
      from tour_control tc2 
      where tc2.tour_id = '${body.tour_id}'
        and tc2.duration <= ${body.duration}
        and tc2.minimum_pax <= ${numOfPax}
            ${additionalConditional}
      `);
    if (!avaiTours.length) {
      throw new AppError(SEARCH_ERROR.TOUR_NOT_AVAILABLE_WITH_THAT_CONDITIONAL);
    }
  }

  async findAllRate(body: VehicleDetailDto) {
    const redisKey = buildVehicleDetailCacheKey(body);
    const numOfPax = body.adult + body.children + body.infant;
    const handle = async () => {
      const rows = await this.entityManager.query(`
        select 
          id,
          tour_id,
          rate_detail,
          cancellation_policies,
          name,
          full_rate ,
          currency 
        from tour_rate tr 
        where 
          tr.tour_id = '${body.tour_id}'
          and tr.minimum_pax  <= ${numOfPax}
          and tr.maximum_pax  >= ${numOfPax}
          and tr.is_active = true
    `);

      // const tours = _(rows)
      //   .groupBy('tour_id')
      //   .map((items, tourId) => ({
      //     // eslint-disable-next-line camelcase
      //     tour_id: tourId,
      //     // eslint-disable-next-line camelcase
      //     rate_ids: items,
      //   }))
      //   .value();

      return rows[0];
    };
    const hotels = await this.redisService.cachedExecute(
      {
        key: `${REDIS_KEY.HOTEL_AVAIL_RATE}:${redisKey}`,
        ttl: REDIS_EXPIRED['1_DAYS'],
      },
      handle,
    );

    return hotels;
  }

  mergeRoomInfo(roomsInfo: any[], rates: any[]) {}
}
