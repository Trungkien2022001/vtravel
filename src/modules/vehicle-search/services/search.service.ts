import { CurrencyService } from '../../currency/services/currency.service';
/* eslint-disable camelcase */
import { EntityManager } from 'typeorm';
import { ElasticSearchService, RedisService } from 'src/core';
import { Injectable } from '@nestjs/common';
import { DataCenterService } from 'src/modules/data-center';
import * as _ from 'lodash';
import { VehicleSearchByRegionDto } from '../dto';
import * as moment from 'moment';
import {
  DEFAULT_DATE_FORMAT,
  APPLICATION_STARTED_DATE,
} from 'src/shared/constants';

@Injectable()
export class VehicleSearchService {
  constructor(
    private readonly elasticSearchService: ElasticSearchService,
    private readonly redisService: RedisService,
    private readonly currencyService: CurrencyService,
    private readonly entityManager: EntityManager,
    private readonly dataCenterService: DataCenterService,
  ) {}

  async search(body: VehicleSearchByRegionDto) {
    const {
      // adult: numOfAdult,
      // children: numOfChildrend,
      // infant: numOfInfant,
      currency,
      checkin,
      region_id: regionId,
      duration,
    } = body;
    const vehicleRates = await this.getAvailVehicles({
      checkin,
      duration,
      regionId,
    });
    const rates = await this.transFromBasicRates(vehicleRates, currency);
    const vehicleBasicInformation = await this.getBasicVehicleInfo(
      vehicleRates.map((t) => t.vehicle_id),
    );

    return this.mergeVehicleRateInfo(rates, vehicleBasicInformation);
  }

  async getAvailVehicles({ checkin, duration, regionId }) {
    let additionalConditional = '';

    const diffDays = moment(checkin, DEFAULT_DATE_FORMAT).diff(
      moment(APPLICATION_STARTED_DATE),
      'days',
    );
    for (let index = 0; index <= duration; index++) {
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
      where vc.region_id = '${regionId}'
      and vc.max_duration >= ${duration}
          ${additionalConditional}
      `);

    return avaiVehicles;
  }

  async transFromBasicRates(vehicleRates: any[], currency: string) {
    const exchangeRate = await this.currencyService.getExchangeRate(currency);
    const rates = [];
    for (let index = 0; index < vehicleRates.length; index++) {
      const vehicle = vehicleRates[index];
      const rate = vehicle.rate[0];
      if (!rate) {
        continue;
      }
      const price = exchangeRate * rate.VehiclePrice;
      rates.push({
        id: vehicle.vehicle_id,
        rate_name: rate.Id,
        refunable: vehicle.refunable,
        currency,
        price,
      });
    }

    return rates;
  }

  async getBasicVehicleInfo(vehicleIds: string[]) {
    return this.elasticSearchService.getVehiclesInfo(vehicleIds);
  }

  async mergeVehicleRateInfo(rates: any[], informations: any[]) {
    const objRate = {};
    rates.map((rate) => {
      objRate[rate.id] = rate;
    });

    return informations.map((vehicle) => ({
      ...vehicle,
      ...objRate[vehicle.id],
    }));
  }
}
