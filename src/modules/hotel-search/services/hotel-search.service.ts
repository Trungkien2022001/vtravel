/* eslint-disable camelcase */
import { AvailableService } from '../../hotel-available/service/seach.service';
import { EntityManager } from 'typeorm';
import { ElasticSearchService, RedisService } from 'src/core';
import { Injectable } from '@nestjs/common';
import { SearchByRegionDto } from 'src/modules/hotel-available/dto';

@Injectable()
export class HotelSearchService {
  constructor(
    private readonly elasticSearchService: ElasticSearchService,
    private readonly redisService: RedisService,
    private readonly entityManager: EntityManager,
    private readonly availableService: AvailableService,
  ) {}

  async searchByRegion(body: SearchByRegionDto) {
    const hotels = await this.availableService.findHotelAvailable(body);
    const hotelIds = hotels.map((h) => h.hotel_id);

    const hotelsInfo =
      await this.elasticSearchService.findHotelByHotelIds(hotelIds);
    const rateMaps = this.getBestRoomRate(hotels);

    return hotelsInfo.map((hotel: any) => ({
      ...hotel,
      // amenities: hotel.amenities?.map((amenity) => amenity.name),
      rating: hotel.rating?.rating,
      cover_image:
        'https://i.travelapi.com/lodging/1000000/30000/26800/26769/92f0a687_z.jpg',
      total_price: rateMaps[hotel.hotel_id].total_price,
      price_currency: rateMaps[hotel.hotel_id].currency,
    }));
  }

  getBestRoomRate(hotels: any[]) {
    const objHotels = {};
    for (let idx = 0; idx < hotels.length; idx++) {
      const hotel = hotels[idx];
      const hotelId: string = hotel.hotel_id;
      const bestRoomRate = hotel.rooms[0];
      objHotels[hotelId] = {
        total_price: bestRoomRate.total_price,
        currency: bestRoomRate.currency,
      };
    }

    return objHotels;
  }
}
