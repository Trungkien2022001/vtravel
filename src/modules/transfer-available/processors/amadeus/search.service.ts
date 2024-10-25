/* eslint-disable camelcase */
import { HelperService } from './helper.service';
import { Injectable } from '@nestjs/common';
import { TransferSearchDto } from '../../dto';
import { EntityManager } from 'typeorm';
import { RedisService } from 'src/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as builder from 'xmlbuilder';
import {
  DEFAULT_Transfer_PROVIDER_ID,
  Transfer_AMADEUS_ACTIONS,
  REDIS_EXPIRED,
  REDIS_KEY,
  Transfer_AMADEUS_CABIN_CLASS_MAPPING,
  Transfer_AMADEUS_CONFIG,
  SEARCH_ERROR,
  Transfer_PROVIDERS,
  CURRENCY_DECIMALS,
  TECHNICAL_STOP_QUALIFIER,
  Transfer_DATETIME,
  DIRECTION_MAPPING,
  CABIN_CLASS_NAME_MAPPING,
  DURATION_MAP,
} from 'src/shared/constants';
import { TransferProvider } from 'src/shared';
import { AppDataError, ValidateTransferSearchRequest } from 'src/common';
import { transform } from 'camaro';
@Injectable()
export class AmadeusSearchService {
  constructor(
    protected readonly entityManager: EntityManager,
    protected readonly redisService: RedisService,
    protected readonly helperService: HelperService,
  ) {}

  async search(req: TransferSearchDto, agentId: number): Promise<any> {
    ValidateTransferSearchRequest(req);
    const providerCres: TransferProvider[] =
      await this.redisService.cachedExecute(
        {
          key: `${REDIS_KEY.PROVIDER.Transfer}:${DEFAULT_Transfer_PROVIDER_ID}`,
          ttl: REDIS_EXPIRED['1_WEEKS'],
        },
        () =>
          this.entityManager.query(
            `SELECT * from supplier where id = ${DEFAULT_Transfer_PROVIDER_ID}`,
          ),
      );
    const provider = providerCres[0];
    const xmlRequest = this.makeRequest(req, provider);

    const xmlResponse = await this.helperService.sendRequest(
      { ...req, agentId },
      xmlRequest,
      provider,
      Transfer_AMADEUS_ACTIONS.Fare_MasterPricerTravelBoardSearch,
    );
    const jsResp = await this.transformResponse(xmlResponse);

    const decimals = CURRENCY_DECIMALS[jsResp.currency];

    jsResp.service_coverage_grp.forEach((scg) => {
      scg.baggage_allowances = [];
      scg.free_baggage_group.forEach((baggageGroupReference) => {
        const freeBagInfo = jsResp.free_bag_grp.find(
          (fbg) => fbg.item_number === baggageGroupReference.free_bag_number,
        );
        if (freeBagInfo) {
          const freeBaggage = {
            weight: null,
            unit: null,
            piece: null,
            text: null,
          };
          switch (freeBagInfo.code) {
            case 'W': // Weight
              switch (freeBagInfo.unit) {
                case 'K': // Kilograms
                  freeBaggage.weight = freeBagInfo.allowance;
                  freeBaggage.unit = 'kg';
                  break;
                case 'L': // Pounds
                  freeBaggage.weight = freeBagInfo.allowance;
                  freeBaggage.unit = 'lb';
                  break;

                default:
                  break;
              }
              break;
            case 'N': // Number of pieces
              freeBaggage.piece = freeBagInfo.allowance;
              break;
            default:
              break;
          }
          baggageGroupReference.Transfer_info.forEach((grp) => {
            grp.last_items_details.forEach((item) => {
              item.ref_of_legs.forEach(() => {
                scg.baggage_allowances.push({
                  adt: req.adult ? freeBaggage : {},
                  chd: req.children ? freeBaggage : {},
                  inf: {},
                });
              });
            });
          });
        }
      });
    });

    // recommendation
    for (let ir = 0; ir < jsResp.recommendation.length; ir += 1) {
      const rcm = jsResp.recommendation[ir];
      const priceInfo = {
        total_fare: _.round(rcm.price_info[0].amount, decimals),
        total_tax: _.round(rcm.price_info[1].amount, decimals),
        currency: jsResp.currency,
      };
      delete rcm.price_info;
      rcm.price_info = priceInfo;

      for (let is = 0; is < rcm.segment_Transfer_ref.length; is += 1) {
        const segment = rcm.segment_Transfer_ref[is];
        for (let i = 0; i < segment.referencing_detail.length; i += 1) {
          const ref = segment.referencing_detail[i];

          // 'B' : Baggage coverage reference
          if (ref.ref_qualifier === 'B') {
            const freeBaggages = jsResp.service_coverage_grp.find(
              (scg) => scg.item_number === ref.ref_number,
            );
            if (freeBaggages) {
              segment.baggage_allowances = freeBaggages.baggage_allowances;
            }
          } else if (ref.ref_qualifier === 'S') {
            const TransferDetail = jsResp.Transfer_index[
              i
            ].group_of_Transfers.find(
              (x) => x.prop_Transfer_gr_detail[0].ref === ref.ref_number,
            );
            if (TransferDetail) {
              ref.Transfer_details =
                TransferDetail.Transfer_details &&
                TransferDetail.Transfer_details.map((x) => {
                  x.seg_ref = jsResp.Transfer_index[i].seg_ref;

                  return x;
                });
            }
          }
        }
        segment.referencing_detail = segment.referencing_detail
          .filter((x) => x.Transfer_details)
          .sort((x, y) => {
            const momentX = moment(
              x.Transfer_details[0].product_datetime.date_of_departure,
              'DDMMYY',
            );
            const momentY = moment(
              y.Transfer_details[0].product_datetime.date_of_departure,
              'DDMMYY',
            );
            if (momentX > momentY) return 1;
            if (momentX < momentY) return -1;

            return 0;
          });
      }
    }

    delete jsResp.Transfer_index;

    const availbility = this.cleanup(jsResp, req, provider);
    const response = this.correctTransferInfo(availbility, req);

    return response;
  }

  makeRequest(req: TransferSearchDto, provider: TransferProvider) {
    const reqTravelBoard = this.helperService.baseSoap(
      provider,
      Transfer_AMADEUS_ACTIONS.Fare_MasterPricerTravelBoardSearch,
    );
    const providerountCode =
      Transfer_AMADEUS_CONFIG.ListAccountCodes[provider.airline_code];
    const customPriceTypes = _.get(
      provider,
      'supplier_custom_config.fare_options',
      [],
    );

    let priceType = customPriceTypes.length
      ? customPriceTypes
      : this.helperService.getPriceTypes('Transfer', provider.airline_code);

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
        travelTransferInfo: {},
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
        Transfer_AMADEUS_CABIN_CLASS_MAPPING[req.cabin_class] ||
        req.cabin_class;
      body.Fare_MasterPricerTravelBoardSearch.itinerary.forEach((x) => {
        x.TransferInfo = {
          cabinId: {
            cabinQualifier: 'MD', // Mandatory cabin for all segments
            cabin: cabinClassCode,
          },
        };
      });
    }

    if (this.helperService.searchByCompanyIdentity(provider)) {
      body.Fare_MasterPricerTravelBoardSearch.travelTransferInfo = {
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

  async transformResponse(xml: string) {
    const template = {
      error: {
        code: 'number(//applicationError/applicationErrorDetail/error)',
        message: '//errorMessageText/description',
      },
      session: {
        session_id: '//awsse:Session/awsse:SessionId',
        sequence_number: 'number(//awsse:Session/awsse:SequenceNumber)',
        security_token: '//awsse:Session/awsse:SecurityToken',
      },
      currency:
        '//Fare_MasterPricerTravelBoardSearchReply/conversionRate/conversionRateDetail/currency',
      advisory_type_info:
        '//Fare_MasterPricerTravelBoardSearchReply/replyStatus/status/advisoryTypeInfo',
      Transfer_index: [
        '//Fare_MasterPricerTravelBoardSearchReply/TransferIndex',
        {
          seg_ref: 'requestedSegmentRef/segRef',
          group_of_Transfers: [
            'groupOfTransfers',
            {
              prop_Transfer_gr_detail: [
                'propTransferGrDetail/TransferProposal',
                {
                  ref: 'ref',
                  unit_qualifier: 'unitQualifier',
                },
              ],
              Transfer_details: [
                'TransferDetails',
                {
                  product_datetime: {
                    date_of_departure:
                      'TransferInformation/productDateTime/dateOfDeparture',
                    time_of_departure:
                      'TransferInformation/productDateTime/timeOfDeparture',
                    date_of_arrival:
                      'TransferInformation/productDateTime/dateOfArrival',
                    time_of_arrival:
                      'TransferInformation/productDateTime/timeOfArrival',
                  },
                  location: [
                    'TransferInformation/location',
                    {
                      location_id: 'locationId',
                      terminal: 'terminal',
                    },
                  ],
                  technical_stops: [
                    'technicalStop/stopDetails',
                    {
                      dateQualifier: 'dateQualifier',
                      date: 'date',
                      firstTime: 'firstTime',
                      locationId: 'locationId',
                    },
                  ],
                  company: {
                    marketing_carrier:
                      'TransferInformation/companyId/marketingCarrier',
                    operating_carrier:
                      'TransferInformation/companyId/operatingCarrier',
                  },
                  Transfer_ortrain_number:
                    'TransferInformation/TransferOrtrainNumber',
                  equipment_type:
                    'TransferInformation/productDetail/equipmentType',
                  electronic_ticketing:
                    'TransferInformation/addProductDetail/electronicTicketing',
                },
              ],
            },
          ],
        },
      ],
      recommendation: [
        '//Fare_MasterPricerTravelBoardSearchReply/recommendation',
        {
          item_number_id: 'itemNumber/itemNumberId/number',
          price_info: [
            'recPriceInfo/monetaryDetail',
            {
              amount: 'amount',
            },
          ],
          segment_Transfer_ref: [
            'segmentTransferRef',
            {
              referencing_detail: [
                'referencingDetail',
                {
                  ref_qualifier: 'refQualifier',
                  ref_number: 'refNumber',
                },
              ],
            },
          ],
          pax_fare_product: {
            pax_fare_detail: {
              pax_fare_num: 'paxFareProduct/paxFareDetail/paxFareNum',
              total_fare_amount: 'paxFareProduct/paxFareDetail/totalFareAmount',
              total_tax_amount: 'paxFareProduct/paxFareDetail/totalTaxAmount',
              code_share_details: {
                transport_stage_qualifier:
                  'paxFareProduct/paxFareDetail/codeShareDetails/transportStageQualifier',
                company:
                  'paxFareProduct/paxFareDetail/codeShareDetails/company',
              },
              pricing_ticketing: {
                price_type:
                  'paxFareProduct/paxFareDetail/pricingTicketing/priceType',
              },
            },
            fare_breakdowns: [
              'paxFareProduct/paxReference/traveller',
              {
                pax_id: 'ref',
                total_fare: 'number(../../paxFareDetail/totalFareAmount)',
                base_fare:
                  'number(../../paxFareDetail/totalFareAmount) - number(../../paxFareDetail/totalTaxAmount)',
                pax_type: '../ptc',
              },
            ],
            fare: [
              'paxFareProduct/fare',
              {
                pricing_message: {
                  free_text_qualification: {
                    text_subject_qualifier:
                      'pricingMessage/freeTextQualification/textSubjectQualifier',
                    information_type:
                      'pricingMessage/freeTextQualification/informationType',
                  },
                  description: ['pricingMessage', 'description'],
                },
              },
            ],
            fare_details: [
              'paxFareProduct/fareDetails',
              {
                segment_ref: 'segmentRef/segRef',
                group_of_fares: [
                  'groupOfFares',
                  {
                    production_information: {
                      cabin_production: {
                        rbd: 'productInformation/cabinProduct/rbd',
                        cabin: 'productInformation/cabinProduct/cabin',
                      },
                      fare_production_detail: {
                        fare_basics:
                          'productInformation/fareProductDetail/fareBasis',
                        passenger_type:
                          'productInformation/fareProductDetail/passengerType',
                        fare_type:
                          'productInformation/fareProductDetail/fareType',
                      },
                      break_point: 'productInformation/breakPoint',
                    },
                  },
                ],
              },
            ],
          },
        },
      ],
      service_coverage_grp: [
        '//Fare_MasterPricerTravelBoardSearchReply/serviceFeesGrp/serviceCoverageInfoGrp',
        {
          item_number: 'itemNumberInfo/itemNumber/number',
          request_segment: [
            'serviceCovInfoGrp/coveragePerTransfersInfo',
            'numberOfItemsDetails/referenceQualifier',
          ],
          free_baggage_group: [
            'serviceCovInfoGrp',
            {
              Transfer_info: [
                'coveragePerTransfersInfo',
                {
                  ref_number: 'numberOfItemsDetails/refNum',
                  last_items_details: [
                    'lastItemsDetails',
                    {
                      ref_of_legs: ['refOfLeg', '.'],
                    },
                  ],
                },
              ],
              free_bag_number:
                'refInfo/referencingDetail[refQualifier="F"]/refNumber',
            },
          ],
        },
      ],
      free_bag_grp: [
        '//Fare_MasterPricerTravelBoardSearchReply/serviceFeesGrp/freeBagAllowanceGrp',
        {
          item_number: 'itemNumberInfo/itemNumberDetails/number',
          allowance: 'number(freeBagAllownceInfo/baggageDetails/freeAllowance)',
          code: 'freeBagAllownceInfo/baggageDetails/quantityCode',
          unit: 'freeBagAllownceInfo/baggageDetails/unitQualifier',
        },
      ],
    };

    const resp = await transform(xml, template);
    if (resp.error.code && resp.error.message) {
      throw new AppDataError(SEARCH_ERROR.PROVIDER_ERROR, {
        provider: Transfer_PROVIDERS.AMADEUS,
        code: resp.error.code,
        message: resp.error.message,
      });
    }

    delete resp.error;

    return resp;
  }

  cleanup(jsResp, req: TransferSearchDto, acc: TransferProvider) {
    let Transfers = [];
    const mapPaxType = this.helperService.getPaxTypeMapping(acc.airline_code);

    for (let ir = 0; ir < jsResp.recommendation.length; ir += 1) {
      const rcm = jsResp.recommendation[ir];
      for (let is = 0; is < rcm.segment_Transfer_ref.length; is += 1) {
        const Transfer = rcm.segment_Transfer_ref[is];

        const nonRefundable = rcm.pax_fare_product.fare.find((x) =>
          x.pricing_message.description.includes('TICKETS ARE NON-REFUNDABLE'),
        );
        const newTransfer = {
          Transfer_id: '',
          outbound: [],
          inbound: [],
          fares: [],
          nonRefundable: !!nonRefundable,
          supplier_code: acc.code,
          supplier_source: acc.source_id,
        };

        if (req.multi_city) {
          let multiCityOutbound = req.multi_city.map((multiCityItem) => {
            return this.getSegments(
              Transfer.referencing_detail,
              rcm.pax_fare_product.fare_details,
              {
                departure_airport_code: multiCityItem.departure_airport_code,
                arrival_airport_code: multiCityItem.arrival_airport_code,
              },
              DIRECTION_MAPPING.outbound,
            );
          });

          multiCityOutbound = multiCityOutbound.map((segments, index) => {
            return segments.map((segment) => ({
              ...segment,
              break_index: index + 1,
            }));
          });

          multiCityOutbound = _.flatten(multiCityOutbound);

          newTransfer.outbound = multiCityOutbound;
        } else {
          newTransfer.outbound = this.getSegmentsV2(
            Transfer.referencing_detail[0],
            rcm.pax_fare_product.fare_details[0],
          );
        }

        if (req.is_round_trip)
          newTransfer.inbound = this.getSegmentsV2(
            Transfer.referencing_detail[1],
            rcm.pax_fare_product.fare_details[1],
          );

        if (
          (req.is_round_trip &&
            newTransfer.outbound &&
            newTransfer.outbound.length > 0 &&
            newTransfer.inbound &&
            newTransfer.inbound.length > 0) ||
          (!req.is_round_trip &&
            newTransfer.outbound &&
            newTransfer.outbound.length > 0)
        ) {
          rcm.pax_fare_product.fare_details.forEach((fareDetail) => {
            fareDetail.group_of_fares.forEach((groupFaresInfo) => {
              const bookingClass =
                groupFaresInfo.production_information.cabin_production.rbd;
              const cabinClass =
                groupFaresInfo.production_information.cabin_production.cabin;

              const fare = {
                cabin_class: CABIN_CLASS_NAME_MAPPING[cabinClass] || cabinClass,
                booking_class: bookingClass,
                base_fare: rcm.price_info.total_fare - rcm.price_info.total_tax,
                total_fare: rcm.price_info.total_fare,
                currency: jsResp.currency,
                passenger_type: _.get(
                  groupFaresInfo,
                  'production_information.fare_production_detail.passenger_type',
                ),
                fare_breakdowns: rcm.pax_fare_product.fare_breakdowns.map(
                  (x) => {
                    const paxType = mapPaxType[x.pax_type];

                    return {
                      ...x,
                      currency: jsResp.currency,
                      pax_type: paxType,
                      pax_id: x.pax_type + x.pax_id,
                    };
                  },
                ),

                cabin_allowance: [],
                fare_basis_code: '',
                baggage_allowance: [],
              };

              const segments = [
                ...(newTransfer.outbound || []),
                ...(newTransfer.inbound || []),
              ];

              fare.fare_basis_code = _(segments)
                .map((i) => i.fare_basis_code)
                .unionBy()
                .join('|');
              fare.booking_class = _(segments)
                .map((x) => x.booking_class)
                .unionBy()
                .join('|');

              fare.baggage_allowance = segments.map((sm, smId) => ({
                ...((Transfer.baggage_allowances &&
                  Transfer.baggage_allowances[smId]) ||
                  {}),
                Transfer_no: sm.Transfer_no,
              }));
              newTransfer.fares.push(fare);

              if (!req.multi_city) {
                // set segment break_index by break_point
                let breakIndex = 1;
                for (let sIdx = 0; sIdx < segments.length; sIdx += 1) {
                  const segment = segments[sIdx];
                  segment.break_index = breakIndex;
                  if (segment.break_point === 'Y') breakIndex += 1;
                }
              }
            });
          });

          if ([...newTransfer.outbound, ...newTransfer.inbound].length > 0) {
            newTransfer.Transfer_id = this.makeTransferId([
              ...newTransfer.outbound,
              ...newTransfer.inbound,
            ]);
          }

          Transfers.push(newTransfer);
        }
      }
    }
    let someHasSpecialFare = false;
    Transfers = _.chain(Transfers)
      .groupBy('Transfer_id')
      .map((fltGrp) => {
        const fares = _.chain(fltGrp)
          .map('fares')
          .flattenDeep()
          .groupBy((x) => `${x.fare_basis_code}-${x.passenger_type}`)

          .map((fareGrp) => {
            const minFare = _.minBy(fareGrp, 'total_fare');

            minFare.is_special_fare =
              Transfer_AMADEUS_CONFIG.orderPassengerType[acc.airline_code] &&
              minFare.passenger_type &&
              Transfer_AMADEUS_CONFIG.orderPassengerType[
                acc.airline_code
              ].includes(minFare.passenger_type);
            if (minFare.is_special_fare) {
              someHasSpecialFare = true;
            }

            return minFare;
          })
          .value();

        return {
          ...fltGrp[0],
          fares,
        };
      })
      .filter((Transfer) => {
        const fares = _(Transfer.fares)
          .filter(
            (f) =>
              (someHasSpecialFare && f.is_special_fare) ||
              (!someHasSpecialFare && !f.is_special_fare),
          )
          .groupBy('fare_basis_code')
          .map((fareGrp) => _.minBy(fareGrp, 'total_fare'))
          .value();
        Transfer.fares = fares;

        return fares && fares.length > 0;
      })
      .value();

    return {
      Transfers,
      transaction_id: jsResp.session,
      airline_code: '',
    };
  }

  makeTransferId(segments) {
    const sorted = _.sortBy(segments, (s) =>
      moment(s.departure_date_time, Transfer_DATETIME.GoQuo),
    );

    const TransferNo = _.map(sorted, 'Transfer_no').join('-');

    const departureDate = _.head(sorted).departure_date_time;
    const arrivalDate = _.last(sorted).arrival_date_time;

    return [TransferNo, departureDate, arrivalDate].join('$');
  }
  transformTechnicalStop(technicalStops) {
    const beginTechnicalStop =
      technicalStops &&
      technicalStops.find(
        (stop) =>
          stop.dateQualifier === TECHNICAL_STOP_QUALIFIER.arrival &&
          stop.locationId,
      );
    const endTechnicalStop =
      technicalStops &&
      technicalStops.find(
        (stop) => stop.dateQualifier === TECHNICAL_STOP_QUALIFIER.departure,
      );
    const stopStartDateTime =
      beginTechnicalStop &&
      moment(
        beginTechnicalStop.date + beginTechnicalStop.firstTime,
        'DDMMYYHHmm',
      );
    const stopEndDateTime =
      endTechnicalStop &&
      moment(endTechnicalStop.date + endTechnicalStop.firstTime, 'DDMMYYHHmm');
    if (beginTechnicalStop && endTechnicalStop) {
      return {
        stop_airport_code: beginTechnicalStop.locationId,
        begin_date_time: stopStartDateTime.format(Transfer_DATETIME.GoQuo),
        end_date_time: stopEndDateTime.format(Transfer_DATETIME.GoQuo),
        duration_minutes: moment
          .duration(stopEndDateTime.diff(stopStartDateTime))
          .asMinutes(),
      };
    }

    return undefined;
  }
  getSegments(referencingDetails, fareDetails, req, direction) {
    const TransferDetails = [];
    const groupFares = [];
    let lastDepartureOutbound = req.departure_airport_code;
    let lastDepartureInbound = req.arrival_airport_code;

    for (let i = 0; i < referencingDetails.length; i += 1) {
      const detail = referencingDetails[i];
      const TransferDetailsMatchRule = [];
      if (direction === DIRECTION_MAPPING.outbound) {
        // eslint-disable-next-line no-loop-func
        detail.Transfer_details.forEach((element) => {
          if (
            element.location[0].location_id === lastDepartureOutbound &&
            lastDepartureOutbound !== req.arrival_airport_code
          ) {
            TransferDetails.push(element);
            TransferDetailsMatchRule.push(element);
            lastDepartureOutbound = element.location[1].location_id;
          }
        });
        if (TransferDetailsMatchRule.length > 0) {
          if (
            fareDetails[i].group_of_fares.length ===
            TransferDetailsMatchRule.length
          ) {
            groupFares.push(...fareDetails[i].group_of_fares);
          }
        }
      }

      if (direction === DIRECTION_MAPPING.inbound) {
        // eslint-disable-next-line no-loop-func
        detail.Transfer_details.forEach((element) => {
          if (
            element.location[0].location_id === lastDepartureInbound &&
            lastDepartureInbound !== req.departure_airport_code
          ) {
            TransferDetails.push(element);
            TransferDetailsMatchRule.push(element);
            lastDepartureInbound = element.location[1].location_id;
          }
        });
        if (TransferDetailsMatchRule.length > 0) {
          if (
            fareDetails[i].group_of_fares.length ===
            TransferDetailsMatchRule.length
          ) {
            groupFares.push(...fareDetails[i].group_of_fares);
          }
        }
      }
    }

    if (TransferDetails.length !== groupFares.length) return [];

    const segments = TransferDetails.map((f, idx) => {
      const cabinClass =
        groupFares[idx].production_information.cabin_production.cabin;
      const bookingClass =
        groupFares[idx].production_information.cabin_production.rbd;
      const fareBasisCode =
        groupFares[idx].production_information.fare_production_detail
          .fare_basics;
      const breakPoint = groupFares[idx].production_information.break_point;
      const dr =
        DURATION_MAP[
          `${f.location[0].location_id}_${f.location[f.location.length - 1].location_id}`
        ];

      return {
        arrival_airport_code: f.location[f.location.length - 1].location_id,
        arrival_date_time: moment(
          f.product_datetime.date_of_arrival +
            f.product_datetime.time_of_arrival,
          'DDMMYYHHmm',
        ).format(Transfer_DATETIME.GoQuo),
        arrival_terminal:
          Number(f.location[f.location.length - 1].terminal) || 0,
        departure_airport_code: f.location[0].location_id,
        departure_date_time: moment(
          f.product_datetime.date_of_departure +
            f.product_datetime.time_of_departure,
          'DDMMYYHHmm',
        ).format(Transfer_DATETIME.GoQuo),
        Transfer_no: `${f.company.marketing_carrier}${f.Transfer_ortrain_number}`,
        operating_carrier:
          f.company.operating_carrier === f.company.marketing_carrier
            ? ''
            : f.company.operating_carrier,
        duration: dr || '',
        booking_class: bookingClass,
        cabin_class: CABIN_CLASS_NAME_MAPPING[cabinClass] || cabinClass,
        fare_basis_code: fareBasisCode,
        break_point: breakPoint,
        technical_stops: this.transformTechnicalStop(f.technical_stops),
        seg_ref: f.seg_ref,
      };
    });

    return segments;
  }

  getSegmentsV2(referencingDetail, fareDetail) {
    const TransferDetails = [];
    const groupFares = [];

    const TransferDetailsMatchRule = [];
    // eslint-disable-next-line no-loop-func
    referencingDetail.Transfer_details.forEach((element) => {
      TransferDetails.push(element);
      TransferDetailsMatchRule.push(element);
    });
    if (TransferDetailsMatchRule.length > 0) {
      if (
        fareDetail.group_of_fares.length === TransferDetailsMatchRule.length
      ) {
        groupFares.push(...fareDetail.group_of_fares);
      }
    }

    if (TransferDetails.length !== groupFares.length) return [];

    const segments = TransferDetails.map((f, idx) => {
      const cabinClass =
        groupFares[idx].production_information.cabin_production.cabin;
      const bookingClass =
        groupFares[idx].production_information.cabin_production.rbd;
      const fareBasisCode =
        groupFares[idx].production_information.fare_production_detail
          .fare_basics;
      const breakPoint = groupFares[idx].production_information.break_point;
      const dr =
        DURATION_MAP[
          `${f.location[0].location_id}_${f.location[f.location.length - 1].location_id}`
        ];

      return {
        arrival_airport_code: f.location[f.location.length - 1].location_id,
        arrival_date_time: moment(
          f.product_datetime.date_of_arrival +
            f.product_datetime.time_of_arrival,
          'DDMMYYHHmm',
        ).format(Transfer_DATETIME.GoQuo),
        arrival_terminal:
          Number(f.location[f.location.length - 1].terminal) || 0,
        departure_airport_code: f.location[0].location_id,
        departure_date_time: moment(
          f.product_datetime.date_of_departure +
            f.product_datetime.time_of_departure,
          'DDMMYYHHmm',
        ).format(Transfer_DATETIME.GoQuo),
        Transfer_no: `${f.company.marketing_carrier}${f.Transfer_ortrain_number}`,
        operating_carrier:
          f.company.operating_carrier === f.company.marketing_carrier
            ? ''
            : f.company.operating_carrier,
        duration: dr || '',
        booking_class: bookingClass,
        cabin_class: CABIN_CLASS_NAME_MAPPING[cabinClass] || cabinClass,
        fare_basis_code: fareBasisCode,
        break_point: breakPoint,
        technical_stops: this.transformTechnicalStop(f.technical_stops),
        seg_ref: f.seg_ref,
      };
    });

    return segments;
  }

  correctTransferInfo(resp, searchReq: TransferSearchDto) {
    const exCludedSuppliers = []; // ['1A']
    resp.Transfers.forEach((Transfer) => {
      if (
        exCludedSuppliers.indexOf(Transfer.supplier_code) > -1 ||
        !Transfer.fares ||
        !Transfer.fares.length
      ) {
        return;
      }

      const cabinClassInfo = {
        outbound: [],
        inbound: [],
      };
      const bookingClassInfo = {
        outbound: [],
        inbound: [],
      };
      const ob = _.get(Transfer, 'outbound', []);
      const obOrderByDestinationTime = _.sortBy(ob, (s) =>
        moment(s.departure_date_time, Transfer_DATETIME.GoQuo),
      );
      obOrderByDestinationTime.forEach((sm) => {
        if (sm.cabin_class) cabinClassInfo.outbound.push(sm.cabin_class);
        if (sm.booking_class) bookingClassInfo.outbound.push(sm.booking_class);
      });
      const ib = _.get(Transfer, 'inbound', []);
      const ibOrderByDestinationTime = _.sortBy(ib, (s) =>
        moment(s.departure_date_time, Transfer_DATETIME.GoQuo),
      );
      ibOrderByDestinationTime.forEach((sm) => {
        if (sm.cabin_class) cabinClassInfo.inbound.push(sm.cabin_class);
        if (sm.booking_class) bookingClassInfo.inbound.push(sm.booking_class);
      });

      const regSplit = /\/|\|/;

      Transfer.fares.forEach((fare) => {
        const fareCabinClass = _.cloneDeep(cabinClassInfo);
        const fareBookingClass = _.cloneDeep(bookingClassInfo);
        const cabinClasses = (fare.cabin_class || '').split(regSplit);
        const bookingClasses = (fare.booking_class || '').split(regSplit);
        if (!fareCabinClass.outbound.length && !fareCabinClass.inbound.length) {
          fareCabinClass.outbound = ob.map(
            (sm, idx) => cabinClasses[idx] || cabinClasses[0],
          );
          fareCabinClass.inbound = ib.map(
            (sm, idx) => cabinClasses[idx] || cabinClasses[0],
          );
        }

        if (
          !fareBookingClass.outbound.length &&
          !fareBookingClass.inbound.length
        ) {
          fareBookingClass.outbound = ob.map(
            (sm, idx) => bookingClasses[idx] || bookingClasses[0],
          );
          fareBookingClass.inbound = ib.map(
            (sm, idx) => bookingClasses[idx] || bookingClasses[0],
          );
        }

        fareBookingClass.outbound =
          fare.cabin_class_outbound && fare.cabin_class_outbound.length > 0
            ? fare.cabin_class_outbound
            : fareBookingClass.outbound;

        fareBookingClass.inbound =
          fare.cabin_class_inbound && fare.cabin_class_inbound.length > 0
            ? fare.cabin_class_inbound
            : fareBookingClass.inbound;

        if (fare.cabin_class_outbound || fare.cabin_class_inbound) {
          delete fare.cabin_class_outbound;
          delete fare.cabin_class_inbound;
        }

        fare.cabin_class_info = fareCabinClass;
        fare.booking_class_info = fareBookingClass;
      });

      if (!searchReq.multi_city) {
        // Hardcode break_index for all provider
        Transfer.outbound.forEach((seg) => {
          seg.break_index = 1;
        });
        const isHasInboundSegments =
          Transfer.inbound && Transfer.inbound.length;
        if (isHasInboundSegments) {
          Transfer.inbound.forEach((seg) => {
            seg.break_index = 2;
          });
        }
      }
    });

    return resp.Transfers;
  }
}
