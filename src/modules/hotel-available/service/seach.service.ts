import { RedisService } from 'src/core';
import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import {
  BINARY_AVAIL_ROOM_CHECK,
  DEFAULT_CURRENCY,
  REDIS_EXPIRED,
  REDIS_KEY,
} from 'src/shared/constants';
import { SearchByHotelIdsDto, SearchByRegionDto } from '../dto';
import { getBitsArray } from 'src/common';
import * as _ from 'lodash';

@Injectable()
export class AvailableService {
  constructor(
    protected readonly entityManager: EntityManager,
    protected readonly redisService: RedisService,
  ) {}

  async findHotelAvailable(body: SearchByRegionDto) {
    const activeHotels = await this.findActiveHotelIdsFromRegion(body);
    if (!activeHotels.length) {
      return [];
    }
    const hotelIds = await activeHotels.map((h) => h.hotel_id);
    const hotelRates = await this.getHotelRates(hotelIds);

    return this.mergeHotelRate(activeHotels, hotelRates);
  }

  async findActiveHotelIdsFromRegion(body: SearchByRegionDto): Promise<any[]> {
    const maxAdult = body.rooms[0].adult;
    const maxChildren = body.rooms[0].children;
    const maxInfant = body.rooms[0].infant;
    const binaryAvailRoomCheck = getBitsArray(10, 3);
    const handle = async () => {
      const rows = await this.entityManager.query(`
        select 
          rc.hotel_id,
          rc.room_id
        from room_control rc 
        inner join hotel_mapping hm on hm.hotel_id = rc.hotel_id 
        where hm.region_id = '${body.region_id}'
          and hm.is_active = true
          and rc.max_adult >= ${maxAdult}
          and rc.max_children >= ${maxChildren}
          and rc.max_infant >= ${maxInfant}
          and rc.availability & B'${binaryAvailRoomCheck}' = ${BINARY_AVAIL_ROOM_CHECK}
    `);

      return _(rows)
        .groupBy('hotel_id')
        .map((items, hotelId) => ({
          // eslint-disable-next-line camelcase
          hotel_id: hotelId,
          // eslint-disable-next-line camelcase
          room_ids: items.map((i) => i.room_id),
        }))
        .value();
    };
    const hotels = await this.redisService.cachedExecute(
      {
        key: `${REDIS_KEY.HOTEL_ROOMS_FROM_REGION}:${body.region_id}`,
        ttl: REDIS_EXPIRED['1_DAYS'],
      },
      handle,
    );

    return hotels;
  }
  async findRoomsIdsFromHotelIds(body: SearchByHotelIdsDto): Promise<any[]> {
    const maxAdult = body.rooms[0].adult;
    const maxChildren = body.rooms[0].children;
    const maxInfant = body.rooms[0].infant;
    const binaryAvailRoomCheck = getBitsArray(10, 3);
    const handle = async () => {
      const rows = await this.entityManager.query(`
        select 
          rc.room_id 
        from room_control rc 
          where rc.hotel_id in (${body.hotel_ids.map((id) => `'${id}'`).join(',')})
          and rc.max_adult >= ${maxAdult}
          and rc.max_children >= ${maxChildren}
          and rc.max_infant >= ${maxInfant}
          and rc.availability & B'${binaryAvailRoomCheck}' = ${BINARY_AVAIL_ROOM_CHECK}
    `);

      return rows.map((r) => r.room_id);
    };
    const hotels = await handle();

    return hotels;
  }
  async findRateDetailsByRoomsIds(roomIds: string[]): Promise<any> {
    const rates = await this.entityManager.query(`
     select 
      rr.hotel_id,
      rr.room_id,
      rr.rate_code,
      rr.rate_name,
      rr.full_rate,
      rr.is_has_extra_bed,
      rr.extra_bed_rate,
      rr.extra_children,
      rr.extra_infant,
      rr.cancellation_policies,
      rr.tax,
      rr.fee
    from room_rate rr
    where rr.room_id in (${roomIds.map((id) => `'${id}'`).join(',')})
      and rr.is_active = true
      and rr.is_deleted = false
      `);

    return rates;
  }
  async getHotelRates(hotelIds: string[]) {
    const hotels = this.entityManager.query(`
      select 
        hotel_id,
        best_price_combination 
      from hotel h 
      where h.hotel_id in(${hotelIds.map((id) => `'${id}'`).join(',')})
        and h.is_deleted = false`);

    return hotels;
  }

  async mergeHotelRate(activeHotels, rates) {
    const mergedData = _.values(
      _.mergeWith(
        _.keyBy(activeHotels, 'hotel_id'),
        _.keyBy(rates, 'hotel_id'),
      ),
    );

    mergedData.forEach((hotel) => {
      // eslint-disable-next-line camelcase
      let rooms = hotel.best_price_combination.filter((b) =>
        hotel.room_ids.includes(b.room_id),
      );

      rooms = rooms.map((room) => {
        const totalPrice = room.full_rate + room.tax + room.fee;

        return {
          room_id: room.room_id,
          currency: room.currency || DEFAULT_CURRENCY,
          rate_code: room.rate_code,
          board_code: room.rate_name,
          total_price: totalPrice,
          cancellation_policies: room.cancellation_policies,
        };
      });

      delete hotel.room_ids;
      delete hotel.best_price_combination;

      hotel.rooms = rooms;
    });

    return mergedData;
  }
}
