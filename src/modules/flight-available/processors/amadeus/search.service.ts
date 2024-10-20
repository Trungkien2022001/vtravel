import { HelperService } from './helper.service';
import { Injectable } from '@nestjs/common';
import { FlightSearchDto } from '../../dto';
import { EntityManager } from 'typeorm';
import { RedisService } from 'src/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as builder from 'xmlbuilder';
import {
  DEFAULT_FLIGHT_PROVIDER_ID,
  FLIGHT_AMADEUS_ACTIONS,
  REDIS_EXPIRED,
  REDIS_KEY,
  FLIGHT_AMADEUS_CABIN_CLASS_MAPPING,
  FLIGHT_AMADEUS_CONFIG,
} from 'src/shared/constants';
import { FlightProvider } from 'src/shared';
import { ValidateFlightSearchRequest } from 'src/common';
@Injectable()
export class AmadeusSearchService {
  constructor(
    protected readonly entityManager: EntityManager,
    protected readonly redisService: RedisService,
    protected readonly helperService: HelperService,
  ) {}

  async search(body: FlightSearchDto): Promise<any> {
    ValidateFlightSearchRequest(body);
    const providerCres: FlightProvider[] =
      await this.redisService.cachedExecute(
        {
          key: `${REDIS_KEY.PROVIDER.FLIGHT}:${DEFAULT_FLIGHT_PROVIDER_ID}`,
          ttl: REDIS_EXPIRED['1_WEEKS'],
        },
        () =>
          this.entityManager.query(
            `SELECT * from supplier where id = ${DEFAULT_FLIGHT_PROVIDER_ID}`,
          ),
      );
    const provider = providerCres[0];
    const xmlRequest = this.makeRequest(body, provider);

    const response = await this.helperService.sendRequest(
      xmlRequest,
      provider,
      FLIGHT_AMADEUS_ACTIONS.Fare_MasterPricerTravelBoardSearch,
    );

    return response;
  }

  makeRequest(req: FlightSearchDto, provider: FlightProvider) {
    const reqTravelBoard = this.helperService.baseSoap(
      provider,
      FLIGHT_AMADEUS_ACTIONS.Fare_MasterPricerTravelBoardSearch,
    );
    const providerountCode =
      FLIGHT_AMADEUS_CONFIG.ListAccountCodes[provider.airline_code];
    const customPriceTypes = _.get(
      provider,
      'supplier_custom_config.fare_options',
      [],
    );

    let priceType = customPriceTypes.length
      ? customPriceTypes
      : this.helperService.getPriceTypes('flight', provider.airline_code);

    // eslint-disable-next-line prefer-const
    let { corporate, searchOptions } = this.getCorpLogicHandler({
      corporateCode: req.corporate_codes ? req.corporate_codes[0] : '',
      corporateId: req.corporate_id,
    });

    if (corporate) {
      if (!priceType.includes('RW')) {
        priceType = priceType.concat('RW');
      }
    }

    // Get default with the current version.
    if (!corporate && !searchOptions && providerountCode) {
      corporate = {
        corporateId: {
          corporateQualifier: 'RW',
          identity: providerountCode,
        },
      };
    }

    const rePaxTypeMap = this.helperService.getRePaxtypeMapping(
      provider.airline_code,
    );

    const itinerary = (() => {
      if (req.multi_city) {
        return req.multi_city.map((multiCityItem, index) => {
          return {
            requestedSegmentRef: { segRef: `${index + 1}` },
            departureLocalization: {
              departurePoint: {
                locationId: multiCityItem.departure_airport_code,
              },
            },
            arrivalLocalization: {
              arrivalPointDetails: {
                locationId: multiCityItem.arrival_airport_code,
              },
            },
            timeDetails: {
              firstDateTimeDetail: {
                date: moment(multiCityItem.departure_date, 'YYYY-MM-DD').format(
                  'DDMMYY',
                ),
              },
            },
          };
        });
      }

      let itineraryData = [];

      itineraryData = itineraryData.concat([
        {
          requestedSegmentRef: { segRef: '1' },
          departureLocalization: {
            departurePoint: {
              locationId: req.departure_airport_code,
            },
          },
          arrivalLocalization: {
            arrivalPointDetails: {
              locationId: req.arrival_airport_code,
            },
          },
          timeDetails: {
            firstDateTimeDetail: {
              date: moment(req.departure_date).format('DDMMYY'),
            },
          },
        },
      ]);

      if (req.is_round_trip) {
        itineraryData = itineraryData.concat([
          {
            requestedSegmentRef: { segRef: '2' },
            departureLocalization: {
              departurePoint: { locationId: req.arrival_airport_code },
            },
            arrivalLocalization: {
              arrivalPointDetails: {
                locationId: req.departure_airport_code,
              },
            },
            timeDetails: {
              firstDateTimeDetail: {
                date: moment(req.return_date).format('DDMMYY'),
              },
            },
          },
        ]);
      }

      return itineraryData;
    })();

    const body = {
      Fare_MasterPricerTravelBoardSearch: {
        numberOfUnit: {
          unitNumberDetail: [
            {
              numberOfUnits: req.adult + (req.children || 0),
              typeOfUnit: 'PX',
            },
            {
              numberOfUnits: 250,
              typeOfUnit: 'RC',
            },
          ],
        },
        paxReference: [
          {
            ptc: rePaxTypeMap.ADT,
            traveller: [...Array(req.adult).keys()].map((x) => ({
              ref: x + 1,
            })),
          },
        ],
        searchOptions,
        fareOptions: {
          pricingTickInfo: {
            pricingTicketing: {
              priceType,
            },
          },
          corporate,
          conversionRate: {
            conversionRateDetail: {
              currency: provider.default_currency,
            },
          },
        },
        travelFlightInfo: {},
        itinerary,
      },
    };

    if (req.children) {
      body.Fare_MasterPricerTravelBoardSearch.paxReference.push({
        ptc: rePaxTypeMap.CHD,
        traveller: [...Array(req.children).keys()].map((x) => ({
          ref: req.adult + x + 1,
        })),
      });
    }

    if (req.infant) {
      body.Fare_MasterPricerTravelBoardSearch.paxReference.push({
        ptc: rePaxTypeMap.INF,
        traveller: [...Array(req.infant).keys()].map((x) => ({
          ref: x + 1,
          infantIndicator: 1, // Infant
        })),
      });
    }

    if (req.cabin_class) {
      const cabinClassCode =
        FLIGHT_AMADEUS_CABIN_CLASS_MAPPING[req.cabin_class] || req.cabin_class;
      body.Fare_MasterPricerTravelBoardSearch.itinerary.forEach((x) => {
        x.flightInfo = {
          cabinId: {
            cabinQualifier: 'MD', // Mandatory cabin for all segments
            cabin: cabinClassCode,
          },
        };
      });
    }

    if (this.helperService.searchByCompanyIdentity(provider)) {
      body.Fare_MasterPricerTravelBoardSearch.travelFlightInfo = {
        companyIdentity: {
          carrierQualifier: 'M',
          carrierId: provider.airline_code,
        },
      };
    }

    reqTravelBoard['soapenv:Envelope']['soapenv:Body'] = body;

    return builder.create(reqTravelBoard, { encoding: 'utf-8' }).end();
  }

  getCorpLogicHandler({
    corporateCode,
    corporateId,
  }: {
    corporateCode: string;
    corporateId: string;
  }) {
    let corporate;
    let searchOptions;
    const corporateIdParser = corporateId ? corporateId.split('/') : [];

    if (corporateCode) {
      corporate = {
        corporateId: {
          corporateQualifier: 'RW',
          identity: corporateCode,
        },
      };
    }

    // promocode logic handler
    if (corporateIdParser.length) {
      const promoFlag = corporateIdParser[0];
      const promoAirlineCode = corporateIdParser[1];
      let attributeDetails = [
        {
          qualifier: 'LPC',
          value: corporateCode || '',
        },
      ];

      // Put the flag is P (Promote) for corporateId to choose corporate or promocode
      if (promoFlag === 'P') {
        corporate = undefined;

        if (promoAirlineCode) {
          attributeDetails = attributeDetails.concat([
            {
              qualifier: 'CXR',
              value: promoAirlineCode,
            },
          ]);
        }

        searchOptions = {
          qualifier: 'MPC',
          attributeDetails,
        };
      }
    }

    return {
      corporate,
      searchOptions,
    };
  }

  transformResponse(response: string) {}
}
