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
    const vehicleRates = await this.findAllRate(body);
    const vehicleInfo = await this.elasticSearchService.getVehicleInfo(
      body.vehicle_id,
    );

    return {
      ...vehicleInfo,
      rate: vehicleRates,
    };
  }

  async checkAvailableTour(body: VehicleDetailDto) {
    let additionalConditional = '';

    const diffDays = moment(body.checkin, DEFAULT_DATE_FORMAT).diff(
      moment(APPLICATION_STARTED_DATE),
      'days',
    );
    for (let index = 0; index <= body.duration; index++) {
      additionalConditional += ` and  vc.availability[${diffDays + index}] > 0 \n`;
    }

    const avaiVehicles = await this.entityManager.query(`
      select 
        vc.vehicle_id, 
        vc.airport_code ,
        vc.country_code ,
        vr.rate,
        vr.cancellation_policies,
        vr.refunable
      from vehicle_control vc 
      inner join vehicle_rate vr on vc.id = vr.vehicle_id 
      where vc.vehicle_id = '${body.vehicle_id}'
      and vc.max_duration >= ${body.duration}
          ${additionalConditional}
      `);

    if (!avaiVehicles.length) {
      throw new AppError(
        SEARCH_ERROR.VEHICLE_NOT_AVAILABLE_WITH_THAT_CONDITIONAL,
      );
    }

    return avaiVehicles[0];
  }

  async findAllRate(body: VehicleDetailDto) {
    const redisKey = buildVehicleDetailCacheKey(body);
    let additionalConditional = '';

    const diffDays = moment(body.checkin, DEFAULT_DATE_FORMAT).diff(
      moment(APPLICATION_STARTED_DATE),
      'days',
    );
    for (let index = 0; index <= body.duration; index++) {
      additionalConditional += ` and  vc.availability[${diffDays + index}] > 0 \n`;
    }
    const handle = async () => {
      const rows = await this.entityManager.query(`
         select 
          vc.vehicle_id, 
          vc.airport_code ,
          vc.country_code ,
          vr.rate,
          vr.cancellation_policies,
          vr.refunable
        from vehicle_control vc 
        inner join vehicle_rate vr on vc.id = vr.vehicle_id 
        where vc.vehicle_id = '${body.vehicle_id}'
        and vc.max_duration >= ${body.duration}
            ${additionalConditional}
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
      if (!rows.length) {
        throw new AppError(
          SEARCH_ERROR.VEHICLE_NOT_AVAILABLE_WITH_THAT_CONDITIONAL,
        );
      }

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
}
