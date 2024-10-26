/* eslint-disable quotes */
/* eslint-disable camelcase */
import { HelperService } from './helper.service';
import { Injectable } from '@nestjs/common';
import { VehicleSearchByRegionDto } from '../../dto';
import { EntityManager } from 'typeorm';
import { RedisService } from 'src/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as builder from 'xmlbuilder';
import { transform } from 'camaro';

import { BaseVehicleSearchProcessor } from '../base-processors';
import {
  DEFAULT_VEHICLE_PROVIDER_ID,
  REDIS_EXPIRED,
  REDIS_KEY,
  SEARCH_ERROR,
  VEHICLE_DATETIME_FORMAT,
  VEHICLE_PROVIDER_ACTION,
  VEHICLE_PROVIDERS,
} from 'src/shared/constants';
import { HttpService } from '@nestjs/axios';
import { ProviderLogger } from 'src/common/logger';
import { AppDataError } from 'src/common';
@Injectable()
export class RentalCarsSearchService extends BaseVehicleSearchProcessor {
  constructor(
    protected readonly entityManager: EntityManager,
    protected readonly redisService: RedisService,
    protected readonly helperService: HelperService,
    private readonly httpService: HttpService,
    private readonly providerLogger: ProviderLogger,
  ) {
    super(entityManager);
  }

  async search(req: VehicleSearchByRegionDto, agentId: number): Promise<any> {
    const providerCres: any[] = await this.redisService.cachedExecute(
      {
        key: `${REDIS_KEY.PROVIDER.VEHICLE}:${DEFAULT_VEHICLE_PROVIDER_ID}`,
        ttl: REDIS_EXPIRED['1_WEEKS'],
      },
      () =>
        this.entityManager.query(
          `SELECT * from supplier_vehicle where id = ${DEFAULT_VEHICLE_PROVIDER_ID}`,
        ),
    );
    const provider = providerCres[0];
    const request = {
      browser: {
        ip: '118.70.118.215',
        country_code: 'VN',
        user_agent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
      },
      pick_up: {
        type: 'iata',
        location: 'KUL',
        date_time: '2024-11-05 09:00',
      },
      drop_off: {
        type: 'iata',
        date_time: '2024-11-06 14:00',
        location: 'KUL',
      },
      driver: {
        age: 30,
      },
      wait_time: 2000,
      language_code: 'en-US',
    };
    const mapping = await this.getMapping(request, provider);
    const requestXml = this.makeRequest(request, mapping, provider);
    const res = await this.sendRequest(
      request,
      requestXml,
      provider,
      VEHICLE_PROVIDER_ACTION.SEARCH,
    );
    const jsonResp = await this.transformResponse(request, res);

    return jsonResp;
  }

  makeRequest(req, mapping, acc) {
    const pickUpTime = moment(req.pick_up.date_time);
    const dropOffTime = moment(req.drop_off.date_time);

    const reqObj = {
      SearchRQ: {
        '@version': '1.1',
        '@supplierInfo': 'true',
        '@preflang': acc.language,
        '@prefcurr': 'USD',
        Credentials: {
          '@username': acc.username,
          '@password': acc.password,
          '@remoteIp': acc.browser?.ip || '8.8.8.8',
        },
        PickUp: {
          Location: { '@id': mapping.pickUp.source_dest_code },
          Date: {
            '@year': pickUpTime.format('YYYY'),
            '@month': pickUpTime.format('MM'),
            '@day': pickUpTime.format('DD'),
            '@hour': pickUpTime.format('HH'),
            '@minute': pickUpTime.format('mm'),
          },
        },
        DropOff: {
          Location: { '@id': mapping.dropOff.source_dest_code },
          Date: {
            '@year': dropOffTime.format('YYYY'),
            '@month': dropOffTime.format('MM'),
            '@day': dropOffTime.format('DD'),
            '@hour': dropOffTime.format('HH'),
            '@minute': dropOffTime.format('mm'),
          },
        },
        DriverAge: req.driver.age,
      },
    };

    return builder.create(reqObj, { encoding: 'utf-8' }).end();
  }
  async sendRequest(req: any, xml: string, acc: any, action: string) {
    const opts = {
      headers: {
        'Content-Type': 'application/xml',
      },
      data: xml, // Use 'data' instead of 'body' for axios
    };
    let statusCode: number;
    let body: string;
    try {
      const response = await this.httpService
        .post(acc.url, opts.data, { headers: opts.headers })
        .toPromise();
      statusCode = response.status;
      body = response.data;
    } catch (error) {
      // Handle error accordingl
      statusCode = error.status;
      body = error.response.data;
    }
    this.providerLogger.log({
      product: 'FLIGHT',
      body: req,
      request: xml,
      response: body,
      userId: req.agentId,
      statusCode: statusCode,
    });

    return body;
  }

  async transformResponse(req, xml) {
    const template = {
      error: {
        code: '//Error/@id',
        message: '//Error/Message',
      },
      vehicles: [
        '//SearchRS/MatchList/Match',
        {
          id: 'Vehicle/@id',
          info: {
            code: 'Vehicle/@group',
            type: 'Vehicle/@group',
            name: 'Vehicle/Name',
            description: 'Vehicle/Description',
          },
          amenity: {
            seats: 'number(Vehicle/@seats)',
            doors: 'number(Vehicle/@doors)',
            bags: 'number(Vehicle/@suitcases)',
            large_bags: 'number(Vehicle/@bigSuitcase)',
            small_bags: 'number(Vehicle/@smallSuitcase)',
            air_conditioner: 'Vehicle/@aircon',
            auto_transmission: 'Vehicle/@automatic',
            unlimited_mileage: 'Vehicle/@unlimitedMileage',
            fuel_policy: 'Vehicle/@fuelPolicy',
            insurance_package: 'Vehicle/@insurancePkg',
          },
          images: [],
          supplier: {
            name: 'Supplier/@supplierName',
            location_type: 'Supplier/@locType',
            images: [
              '.',
              {
                title: '',
                url: 'Supplier/@small_logo',
                size: 'small',
              },
            ],
            pick_up: {
              lat: 'Supplier/@lat',
              long: 'Supplier/@long',
              address: 'Supplier/@address',
              instructions: 'Supplier/@pickUpInstructions',
              on_airport: 'boolean(Route/PickUp/Location/@onAirport = "yes")',
            },
            drop_off: {
              lat: 'Supplier/@dropOffLat',
              long: 'Supplier/@dropOffLong',
              address: 'Supplier/@dropOffAddress',
              instructions: 'Supplier/@dropOffInstructions',
              on_airport: 'boolean(Route/DropOff/Location/@onAirport = "yes")',
            },
          },
          rating: {
            average: 'number(Ratings/Average)',
            average_text: 'Ratings/AverageText',
          },
          price: {
            currency: 'Price/@baseCurrency',
            amount: 'number(Price/@basePrice)',
          },
          fees: {
            deposit_excess: {
              theft_excess: {
                amount: 'number(Fees/DepositExcessFees/TheftExcess/@amount)',
                currency: 'Fees/DepositExcessFees/TheftExcess/@currency',
                tax_included:
                  'boolean(Fees/DepositExcessFees/TheftExcess/@taxIncluded)',
                unknown_excess_amount: 'boolean("1"="2")',
              },
              damage_excess: {
                amount: 'number(Fees/DepositExcessFees/DamageExcess/@amount)',
                currency: 'Fees/DepositExcessFees/DamageExcess/@currency',
                tax_included:
                  'boolean(Fees/DepositExcessFees/DamageExcess/@taxIncluded)',
                unknown_excess_amount: 'boolean("1"="2")',
              },
              deposit: {
                amount: 'number(Fees/DepositExcessFees/Deposit/@amount)',
                currency: 'Fees/DepositExcessFees/Deposit/@currency',
                tax_included:
                  'boolean(Fees/DepositExcessFees/Deposit/@taxIncluded)',
                unknown_excess_amount: 'boolean("1"="2")',
              },
            },
          },
          special_offer: [
            '.',
            {
              text: 'Vehicle/SpecialOfferText',
            },
          ],
          detail: {
            usd_price: {
              amount: 'number(Price)',
              currency: 'Price/@currency',
            },
            location: {
              pick_up: 'Route/PickUp/Location/@id',
              drop_off: 'Route/DropOff/Location/@id',
            },
          },
          temp: {
            discount: 'number(Price/@discount)',
            basePrice: 'number(Price/@basePrice)',
            available: 'Vehicle/@availabilityCheck',
            vehicle: {
              image: 'Vehicle/LargeImageURL',
              largeImage: 'Vehicle/LargeImageURL',
            },
            freeCancellation: 'Vehicle/@freeCancellation',
            known_fees: [
              'Fees/Fee',
              {
                feeTypeName: '@feeTypeName',
                alwaysPayable: '@alwaysPayable',
                amount: 'number(@amount)',
                currency: '@currency',
                taxIncluded: 'boolean(@taxIncluded)',
                perDuration: '@perDuration',
                feeDistance: '@feeDistance',
                distance: 'number(@distance)',
                iskM: '@iskM',
                unlimited: 'boolean(@unlimited)',
              },
            ],
          },
        },
      ],
    };

    const resp = await transform(xml, template);
    if (resp.error && resp.error.code && resp.error.message) {
      throw new AppDataError(SEARCH_ERROR.PROVIDER_ERROR, {
        provider: VEHICLE_PROVIDERS.CAR_RENTALS,
        code: resp.error.code,
        message: resp.error.message,
      });
    }

    resp.vehicles.forEach((vehicle) => {
      this.cancellationsTransform(vehicle, req.pick_up.date_time);
      this.amenitiesTransform(vehicle);
      this.imagesTransform(vehicle);
      this.vehicleTypeTransform(vehicle);
      this.vehicleKnownFeesTransform(vehicle);
      this.discountTransform(vehicle);
      delete vehicle.temp;
    });

    delete resp.error;

    return resp.vehicles;
  }

  cancellationsTransform(vehicle, pickUpDateTime) {
    const { freeCancellation } = vehicle.temp;
    const now = moment();
    const pickUpTime = moment(pickUpDateTime);
    const beforeTwoDays = moment(pickUpTime).subtract(2, 'd');
    vehicle.refundable =
      freeCancellation === 'true' && now.isBefore(beforeTwoDays);
    if (vehicle.refundable) {
      vehicle.cancellations = [
        {
          from: now.format(VEHICLE_DATETIME_FORMAT.dateTimeFormat.GoQuo),
          to: moment(beforeTwoDays)
            .subtract(1, 's')
            .format(VEHICLE_DATETIME_FORMAT.dateTimeFormat.GoQuo),
          currency: vehicle.price.currency,
          amount: 0,
        },
        {
          from: moment(beforeTwoDays).format(
            VEHICLE_DATETIME_FORMAT.dateTimeFormat.GoQuo,
          ),
          to: moment(pickUpTime).format(
            VEHICLE_DATETIME_FORMAT.dateTimeFormat.GoQuo,
          ),
          currency: vehicle.price.currency,
          amount: vehicle.price.amount,
        },
      ];
    }
  }

  amenitiesTransform(vehicle) {
    vehicle.amenity.seats = { value: vehicle.amenity.seats || 0 };
    vehicle.amenity.doors = { value: vehicle.amenity.doors || 0 };
    vehicle.amenity.bags = { value: vehicle.amenity.bags || 0 };
    vehicle.amenity.large_bags = { value: vehicle.amenity.large_bags || 0 };
    vehicle.amenity.small_bags = { value: vehicle.amenity.small_bags || 0 };
    vehicle.amenity.air_conditioner = {
      value: vehicle.amenity.air_conditioner === 'Yes',
    };
    vehicle.amenity.auto_transmission = {
      value: vehicle.amenity.auto_transmission === 'Automatic',
    };
    vehicle.amenity.unlimited_mileage = {
      value: vehicle.amenity.unlimited_mileage === 'true',
    };
    const fuelPolicyMap = {
      0: { value: 'Undefined', description: 'Undefined' },
      1: { value: 'Full_To_Full', description: 'Full to Full (return same)' },
      2: {
        value: 'Prepay_Non_Refundable',
        description: 'Prepay, no refunds',
      },
      3: { value: 'Prepay_Refundable', description: 'Prepay, w/ refunds' },
      4: { value: 'Free_Tank', description: 'Free Tank' },
    };
    vehicle.amenity.fuel_policy = fuelPolicyMap[vehicle.amenity.fuel_policy];
    const insurancePkgMap = {
      0: { value: 'Undefined', description: 'Undefined' },
      B: {
        value: 'Basic',
        description:
          'Basic - has no insurance included and the supplier will likely require this to be purchased at the counter',
      },
      Z: {
        value: 'Zero Excess',
        description:
          'Zero Excess - cannot be offered FULL PROTECTION but includes CDW included',
      },
      I: {
        value: 'Inclusive',
        description:
          'Inclusive - can be offered FULL PROTECTION and has CDW included',
      },
    };
    vehicle.amenity.insurance_package =
      insurancePkgMap[vehicle.amenity.insurance_package];
  }

  discountTransform(vehicle) {
    vehicle.price.discount_percent = parseFloat(
      `${
        ((vehicle.temp.discount || 0) /
          (vehicle.temp.basePrice + vehicle.temp.discount)) *
        100
      }`,
    );
  }

  vehicleKnownFeesTransform(vehicle) {
    const mileage = vehicle.temp.known_fees.find(
      (i) => i.feeTypeName === 'MILEAGE',
    );

    if (!mileage) {
      return;
    }

    const mileageInfo = {
      unlimited: mileage.unlimited,
      currency: mileage.currency,
      amount: mileage.amount,
      taxIncluded: mileage.taxIncluded,
      limited_distance: mileage.distance,
      unit: mileage.iskM === 'true' ? 'Kilometers' : 'Miles',
    };

    vehicle.fees.known_fees = {
      mileage: mileageInfo,
    };
  }

  vehicleTypeTransform(vehicle) {
    if (!vehicle.info.type) {
      return;
    }
    const typeMap = [
      { name: 'Special', regex: /((X...)|(.V..)).*/ },
      { name: 'Mini', regex: /[EM][^V].*/ },
      { name: 'Economy', regex: /[E][^V].*/ },
      { name: 'Compact', regex: /[C][^V].*/ },
      { name: 'Midsize', regex: /[I][^V].*/ },
      { name: 'Intermediate', regex: /[I][^V].*/ },
      { name: 'Standard', regex: /[S][^V].*/ },
      { name: 'Full', regex: /[F][^V].*/ },
      { name: 'Premium', regex: /[P][^V].*/ },
      { name: 'Luxury', regex: /[L][^V].*/ },
    ];
    vehicle.info.type = typeMap
      .filter((i) => vehicle.info.type.match(i.regex))
      .map((i) => i.name)
      .join('|');
  }

  imagesTransform(vehicle) {
    vehicle.images = [
      {
        title: '',
        url: vehicle.temp.vehicle.image,
        size: 'medium',
      },
      {
        title: '',
        url: vehicle.temp.vehicle.largeImage,
        size: 'large',
      },
    ];
  }
}
