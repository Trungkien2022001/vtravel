/* eslint-disable quotes */
/* eslint-disable camelcase */
import { HelperService } from './helper.service';
import { Injectable } from '@nestjs/common';
import { TransferSearchDto } from '../../dto';
import { EntityManager } from 'typeorm';
import { RedisService } from 'src/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as builder from 'xmlbuilder';
import { transform } from 'camaro';

interface TravelRequest {
  language: string;
  fromType: 'IATA' | string;
  fromCode: string | { latitude: number; longitude: number };
  toType: 'IATA' | string;
  toCode: string | { latitude: number; longitude: number };
  adults: number;
  children?: number;
  infants?: number;
  time: {
    travel: string; // In ISO format (e.g., '2024-10-25T12:00:00')
    return?: string;
  };
}

import { BaseTransferSearchProcessor } from '../base-processors';
import {
  DEFAULT_FLIGHT_PROVIDER_ID,
  DEFAULT_TRANSFER_PROVIDER_ID,
  REDIS_EXPIRED,
  REDIS_KEY,
  TRANSFER_DATETIME_FORMAT,
} from 'src/shared/constants';
@Injectable()
export class HotelBedsSearchService extends BaseTransferSearchProcessor {
  constructor(
    protected readonly entityManager: EntityManager,
    protected readonly redisService: RedisService,
    protected readonly helperService: HelperService,
  ) {
    super(entityManager);
  }

  async search(req: TransferSearchDto, agentId: number): Promise<any> {
    const providerCres: any[] = await this.redisService.cachedExecute(
      {
        key: `${REDIS_KEY.PROVIDER.TRANSFER}:${DEFAULT_TRANSFER_PROVIDER_ID}`,
        ttl: REDIS_EXPIRED['1_WEEKS'],
      },
      () =>
        this.entityManager.query(
          `SELECT * from supplier_transfer where id = ${DEFAULT_TRANSFER_PROVIDER_ID}`,
        ),
    );
    const provider = providerCres[0];
    const requestObj = await this.buildRequest(req, provider);
    let res: any = await this.sendRequest(requestObj, provider);
    res = this.transformResponse(res, req);

    return res;
  }

  async validateRequest(request) {
    if (request.pickup_from === request.dropoff_to)
      return Promise.reject(
        new Error(
          "Parameter 'pickup_from' must be have different value with 'dropoff_to'",
        ),
      );

    if (!request.travel_time)
      return Promise.reject(new Error("Parameter 'travel_time' is required"));

    if (!request.accommodation_geo_coords)
      return Promise.reject(
        new Error("Parameter 'accommodation_geo_coords' is required"),
      );

    const destinations = ['airport', 'accommodation'];

    if (!destinations.includes(request.pickup_from))
      return Promise.reject(
        new Error(
          `Parameter 'pickup_from' must have value in ${JSON.stringify(destinations)}`,
        ),
      );

    if (!destinations.includes(request.dropoff_to))
      return Promise.reject(
        new Error(
          `Parameter 'dropoff_to' must have value in ${JSON.stringify(destinations)}`,
        ),
      );

    if (request.transfer_type === 'return') {
      if (!request.return_date)
        return Promise.reject(new Error("Parameter 'return_date' is required"));

      if (!request.return_time)
        return Promise.reject(new Error("Parameter 'return_time' is required"));
    }

    return Promise.resolve(request);
  }

  async buildRequest(req, provider) {
    await this.validateRequest(req);
    const language = await this.getProviderLanguage(
      req.language_code,
      provider.code,
    );
    const cityMapping = await this.mapAirport2ProviderCity(
      req.airport_code,
      req.provider_code,
    );
    const fromType = req.pickup_from === 'airport' ? 'IATA' : 'GPS';
    const toType = req.dropoff_to === 'accommodation' ? 'GPS' : 'IATA';

    const obj: TravelRequest = {
      language: 'en',
      fromType,
      fromCode:
        fromType === 'IATA'
          ? cityMapping.provider_city_code
          : req.accommodation_geo_coords,
      toType,
      toCode:
        toType === 'IATA'
          ? cityMapping.provider_city_code
          : req.accommodation_geo_coords,
      adults: req.adults,
      children: req.children || 0,
      infants: req.infants || 0,
      time: {
        travel:
          moment(req.travel_date).format(
            TRANSFER_DATETIME_FORMAT.dateFormat.HotelBedsV2,
          ) +
          'T' +
          moment(
            req.travel_time,
            TRANSFER_DATETIME_FORMAT.timeFormat.GoQuo,
          ).format(TRANSFER_DATETIME_FORMAT.timeFormat.HotelBedsV2),
        // return: '',
      },
    };

    if (req.transfer_type === 'return') {
      obj.time.return =
        moment(req.return_date).format(
          TRANSFER_DATETIME_FORMAT.dateFormat.HotelBedsV2,
        ) +
        'T' +
        moment(
          req.return_time,
          TRANSFER_DATETIME_FORMAT.timeFormat.GoQuo,
        ).format(TRANSFER_DATETIME_FORMAT.timeFormat.HotelBedsV2);
    }

    return obj;
  }

  async sendRequest(requestObj, acc) {
    let url = this.helperService.buildUrl(acc.url, 'availability');

    url += `/${requestObj.language}`;
    url += '/from';
    url += `/${requestObj.fromType}`;
    url += `/${requestObj.fromCode}`;
    url += '/to';
    url += `/${requestObj.toType}`;
    url += `/${requestObj.toCode}`;
    url += `/${requestObj.time.travel}`;

    if (requestObj.time.return) url += `/${requestObj.time.return}`;
    url += `/${requestObj.adults}`;
    url += `/${requestObj.children}`;
    url += `/${requestObj.infants}`;
    const response = await this.helperService.getAsync(url, acc);

    return response;
  }

  async transformResponse(response, req) {
    if (!response) {
      const error = new Error(
        JSON.stringify({
          message: `Don't recevie any resp = ${response}`,
        }),
      );
      throw error;
    }

    if (response.code) {
      const message = !response.isBadRequest
        ? response.message
        : JSON.stringify(
            _.get(response, 'fieldErrors', []).map((f) => ({
              field: f.field,
              message: f.message,
            })),
          );

      const error = new Error(JSON.stringify({ code: response.code, message }));
      throw error;
    }

    const data = this.handleSuccess(response, req);

    return data;
  }
  handleSuccess(response, request) {
    const {
      adults,
      travel_date: travelDate,
      pickup_from: pickupFrom,
      dropoff_to: dropoffTo,
    } = request;
    const res = {
      adults: adults,
      children: request.children || 0,
      infants: request.infants || 0,
      travelDate: travelDate,
      returnDate: request.returnDate || '',
      travelling: {
        pickupFrom,
        dropoffTo,
        accommodations: [],
        transfers: this._transform(response, false, request),
      },
      returning: {
        pickupFrom: dropoffTo,
        dropoffTo: pickupFrom,
        accommodations: [],
        transfers: this._transform(response, true, request),
      },
    };

    return res;
  }
  _transform(response, isReturn = false, request) {
    const services = !isReturn
      ? _.filter(response.services, (service) => {
          if (request.pickup_from === 'airport') {
            return (
              service.pickupInformation.from.type === 'IATA' &&
              service.pickupInformation.date === request.travel_date
            );
          } else {
            return (
              service.pickupInformation.from.type === 'ATLAS' &&
              service.pickupInformation.date === request.travel_date
            );
          }
        })
      : _.filter(response.services, (service) => {
          if (request.pickup_from === 'airport') {
            return (
              service.pickupInformation.from.type === 'ATLAS' &&
              service.pickupInformation.date === request.return_date
            );
          } else {
            return (
              service.pickupInformation.from.type === 'IATA' &&
              service.pickupInformation.date === request.return_date
            );
          }
        });

    if (_.isEmpty(services)) return [];

    return services.map((s) => ({
      id: s.rateKey,
      name: `${s.category.name} ${s.vehicle.name}`,
      description: '',
      currencyCode: s.price.currencyId,
      approximateTransferTime: s.pickupInformation.time,
      allowForCheckInTime:
        s.pickupInformation.pickup.checkPickup.mustCheckPickupTime,
      conditions: [],
      images: s.content.images.map((i) => ({
        url: i.url,
        caption: '',
      })),
      vehicles: [
        {
          name: s.vehicle.name,
          code: s.vehicle.code,
          minPax: s.minPaxCapacity,
          maxPax: s.maxPaxCapacity,
          amount: s.price.totalAmount,
          dates: [s.pickupInformation.date],
          times: [s.pickupInformation.time],
        },
      ],
    }));
  }
}
