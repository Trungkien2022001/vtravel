/* eslint-disable camelcase */
import { AvailableService } from '../../hotel-available/service/seach.service';
import { EntityManager } from 'typeorm';
import {
  ElasticSearchService,
  RedisService,
  RegionMappingService,
} from 'src/core';
import { Injectable, Logger } from '@nestjs/common';
import {
  SearchByAirportCodeDto,
  SearchByRegionDto,
} from 'src/modules/hotel-available/dto';
import { DataCenterService } from 'src/modules/data-center';
import * as _ from 'lodash';
import { buildRegionSearchCacheKey } from 'src/common';
import { REDIS_EXPIRED, REDIS_KEY } from 'src/shared/constants';

@Injectable()
export class HotelSearchService {
  constructor(
    private readonly elasticSearchService: ElasticSearchService,
    private readonly redisService: RedisService,
    private readonly entityManager: EntityManager,
    private readonly availableService: AvailableService,
    private readonly regionMappingService: RegionMappingService,
    private readonly dataCenterService: DataCenterService,
  ) {}

  async searchByRegion(body: SearchByRegionDto) {
    const currency = body.currency;
    const numOfRooms = body.rooms.length;
    const cacheKey = buildRegionSearchCacheKey(body);
    const hotels = await this.availableService.findHotelAvailable(body);
    if (!hotels.length) {
      return [];
    }
    const hotelCurrencies = _.uniq(hotels.map((hotel) => hotel.currency));
    const currencyRates = await this.dataCenterService.getConvertCurrencies(
      currency,
      hotelCurrencies,
    );
    const hotelIds = hotels.map((h) => h.hotel_id);

    // const hotelsInfo = await this.redisService.cachedExecute(
    //   {
    //     key: `${REDIS_KEY.ES_HOTELS_INFO}:${cacheKey}`,
    //     ttl: REDIS_EXPIRED['1_DAYS'],
    //   },
    // );
    const hotelsInfo =
      await this.elasticSearchService.findHotelByHotelIds(hotelIds);
    const rateMaps = this.getBestRoomRate(
      hotels,
      numOfRooms,
      currencyRates,
      currency,
    );

    return hotelsInfo.map((hotel: any) => ({
      ...hotel,
      // amenities: hotel.amenities?.map((amenity) => amenity.name),
      rating: hotel.rating?.rating,
      images:
        (hotel.images && hotel.images.length && hotel.images[0].urls) || [],
      total_price: rateMaps[hotel.hotel_id].total_price,
      price_currency: rateMaps[hotel.hotel_id].currency,
    }));
  }
  async searchByAirportCode(body: SearchByAirportCodeDto) {
    const { airport_code: airportCode, ...others } = body;
    const regionId =
      await this.regionMappingService.getRegionFromDestination(airportCode);
    const currency = body.currency;
    const numOfRooms = body.rooms.length;
    const hotels = await this.availableService.findHotelAvailable({
      ...others,
      region_id: regionId,
    });
    const hotelCurrencies = _.uniq(hotels.map((hotel) => hotel.currency));
    const currencyRates = await this.dataCenterService.getConvertCurrencies(
      currency,
      hotelCurrencies,
    );
    const hotelIds = hotels.map((h) => h.hotel_id);

    const hotelsInfo =
      await this.elasticSearchService.findHotelByHotelIds(hotelIds);
    Logger.log(hotelsInfo.length);
    const rateMaps = this.getBestRoomRate(
      hotels,
      numOfRooms,
      currencyRates,
      currency,
    );

    return hotelsInfo.map((hotel: any) => ({
      ...hotel,
      // amenities: hotel.amenities?.map((amenity) => amenity.name),
      rating: hotel.rating?.rating,
      images:
        (hotel.images && hotel.images.length && hotel.images[0].urls) || [],
      total_price: rateMaps[hotel.hotel_id].total_price,
      price_currency: rateMaps[hotel.hotel_id].currency,
    }));
  }

  getBestRoomRate(
    hotels: any[],
    numOfRooms: number,
    currencyRates: any,
    destCurrency: string,
  ) {
    const objHotels = {};
    for (let idx = 0; idx < hotels.length; idx++) {
      const hotel = hotels[idx];
      const hotelId: string = hotel.hotel_id;
      const bestRoomRate = hotel.rooms[0];
      const currency = bestRoomRate.currency;
      const exchangeRate = currencyRates[`${currency}${destCurrency}`] || 1;
      const bestPriceForSingleRoom = bestRoomRate.total_price * exchangeRate;
      // const totalPrice = hotel.rooms
      //   .slice(0, numOfRooms)
      //   .reduce((sum, hotel) => sum + hotel.total_price, 0);
      objHotels[hotelId] = {
        total_price: bestPriceForSingleRoom * numOfRooms,
        currency: destCurrency,
      };
    }

    return objHotels;
  }
}
