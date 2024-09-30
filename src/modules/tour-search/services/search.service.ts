import { CurrencyService } from './../../currency/services/currency.service';
/* eslint-disable camelcase */
import { EntityManager } from 'typeorm';
import { ElasticSearchService, RedisService } from 'src/core';
import { Injectable } from '@nestjs/common';
import { DataCenterService } from 'src/modules/data-center';
import * as _ from 'lodash';
import { TourSearchByRegionDto } from '../dto';
import * as moment from 'moment';
import {
  DEFAULT_DATE_FORMAT,
  APPLICATION_STARTED_DATE,
} from 'src/shared/constants';

@Injectable()
export class TourSearchService {
  constructor(
    private readonly elasticSearchService: ElasticSearchService,
    private readonly redisService: RedisService,
    private readonly currencyService: CurrencyService,
    private readonly entityManager: EntityManager,
    private readonly dataCenterService: DataCenterService,
  ) {}

  async search(body: TourSearchByRegionDto) {
    const {
      adult: numOfAdult,
      children: numOfChildrend,
      infant: numOfInfant,
      currency,
      checkin,
      region_id: regionId,
      duration,
    } = body;
    const numOfPax = numOfAdult + numOfChildrend + numOfInfant;
    const availTous = await this.getAvailTours({
      checkin,
      duration,
      regionId,
      numOfAdult,
      numOfChildrend,
      numOfPax,
    });
    const tourRates = await this.transFromBasicRates(availTous, currency);
    const tourBasicInformation = await this.getBasicTourInfo(
      tourRates.map((t) => t.id),
    );

    return this.mergeTourRateInfo(tourRates, tourBasicInformation);
  }

  async getAvailTours({
    checkin,
    duration,
    regionId,
    numOfAdult,
    numOfChildrend,
    numOfPax,
  }) {
    let additionalConditional = '';

    const diffDays = moment(checkin, DEFAULT_DATE_FORMAT).diff(
      moment(APPLICATION_STARTED_DATE),
      'days',
    );
    for (let index = 0; index <= duration; index++) {
      additionalConditional += ` and  tc2.availability[${diffDays + index}] > 0 \n`;
    }

    const avaiTours = await this.entityManager.query(`
      select 
        t.tour_id ,
        t.country_code ,
        t.city_code ,
        t.region_id,
        t.best_price_combination
      from tour t 
      inner join tour_control tc2 on tc2.tour_id = t.tour_id 
      where t.region_id = '${regionId}'
        and tc2.max_adult >= ${numOfAdult}
        and tc2.max_children >= ${numOfChildrend}
        and tc2.duration <= ${duration}
        and tc2.minimum_pax <= ${numOfPax}
            ${additionalConditional}
      `);

    return avaiTours;
  }

  async transFromBasicRates(availTours: any[], currency: string) {
    const exchangeRate = await this.currencyService.getExchangeRate(currency);
    const tourRates = [];
    for (let index = 0; index < availTours.length; index++) {
      const tour = availTours[index];
      const rate = tour.best_price_combination[0];
      if (!rate) {
        continue;
      }
      const price = exchangeRate * rate.full_rate;
      tourRates.push({
        id: tour.tour_id,
        region_id: tour.region_id,
        country_code: tour.country_code,
        city_code: tour.city_code,
        rate_name: rate.name,
        nonrefunable: !rate.cancellation_policies,
        currency,
        price,
      });
    }

    return tourRates;
  }

  async getBasicTourInfo(tourIds: string[]) {
    return this.elasticSearchService.getToursInfo(tourIds);
  }

  async mergeTourRateInfo(toursRate: any[], toursInfo: any[]) {
    const objRate = {};
    toursRate.map((rate) => {
      objRate[rate.id] = rate;
    });

    return toursInfo.map((tour) => ({
      ...tour,
      ...objRate[tour.id],
    }));
  }
}
