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
import {
  buildRegionSearchCacheKey,
  getBitsArray,
  getMaxNumOfPaxes,
} from 'src/common';
import * as _ from 'lodash';

@Injectable()
export class AvailableService {
  constructor(
    protected readonly entityManager: EntityManager,
    protected readonly redisService: RedisService,
  ) {}

  async findHotelAvailable(body: SearchByRegionDto) {
    const cacheKey = buildRegionSearchCacheKey(body);
    const activeHotels = await this.findActiveHotelIds(body, cacheKey);
    if (!activeHotels.length) {
      return [];
    }
    const hotelIds = await activeHotels.map((h) => h.hotel_id);
    const hotelRates = await this.getHotelRates(hotelIds, cacheKey);

    return this.mergeHotelRate(activeHotels, hotelRates);
  }

  async findHotelAvailableByIds(body: SearchByHotelIdsDto) {
    const activeHotels = await this.findActiveHotelIdsByHotelIds(body);
    if (!activeHotels.length) {
      return [];
    }
    const hotelIds = await activeHotels.map((h) => h.hotel_id);
    const hotelRates = await this.getHotelRates(hotelIds, '', false);

    return this.mergeHotelRate(activeHotels, hotelRates);
  }

  async findActiveHotelIds(
    body: SearchByRegionDto,
    cacheKey?: string,
  ): Promise<any[]> {
    const { maxAdult, maxChildren, maxInfant } = getMaxNumOfPaxes(body.rooms);

    const numOfRooms = body.rooms.length;
    const binaryAvailRoomCheck = getBitsArray(10, 3);
    const redisKey = cacheKey || buildRegionSearchCacheKey(body);

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
        .filter((h) => h.room_ids.length >= numOfRooms)
        .value();
    };
    const hotels = await this.redisService.cachedExecute(
      {
        key: `${REDIS_KEY.HOTEL_ROOMS_FROM_SEARCH_REQUEST}:${redisKey}`,
        ttl: REDIS_EXPIRED['1_DAYS'],
      },
      handle,
    );

    return hotels;
  }

  async findActiveHotelIdsByHotelIds(
    body: SearchByHotelIdsDto,
  ): Promise<any[]> {
    const { maxAdult, maxChildren, maxInfant } = getMaxNumOfPaxes(body.rooms);

    const numOfRooms = body.rooms.length;
    const binaryAvailRoomCheck = getBitsArray(10, 3);

    const handle = async () => {
      const rows = await this.entityManager.query(`
        select 
          rc.hotel_id,
          rc.room_id
        from room_control rc 
        inner join hotel_mapping hm on hm.hotel_id = rc.hotel_id 
        where rc.hotel_id in (${body.hotel_ids.map((id) => `'${id}'`).join(',')})
          and  rc.max_adult >= ${maxAdult}
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
        .filter((h) => h.room_ids.length >= numOfRooms)
        .value();
    };
    const hotels = await handle();

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
    from room_rate_v2 rr
    where rr.room_id in (${roomIds.map((id) => `'${id}'`).join(',')})
      and rr.is_active = true
      and rr.is_deleted = false
      `);

    return rates;
  }
  async getHotelRates(
    hotelIds: string[],
    cacheKey: string,
    isSaveRedis?: boolean,
  ) {
    const hotels = isSaveRedis
      ? await this.redisService.cachedExecute(
          {
            key: `${REDIS_KEY.HOTEL_RATES_FROM_SEARCH_REQUEST}:${cacheKey}`,
            ttl: REDIS_EXPIRED['1_DAYS'],
          },
          () =>
            this.entityManager.query(`
        select 
          hotel_id,
          best_price_combination as rooms
        from hotel h 
        where h.hotel_id in(${hotelIds.map((id) => `'${id}'`).join(',')})
          and h.is_deleted = false`),
        )
      : await this.entityManager.query(`
      select 
        hotel_id,
        best_price_combination as rooms
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
      let rooms = hotel.rooms?.filter((b) =>
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
      delete hotel.rooms;

      hotel.rooms = rooms;
      hotel.currency = rooms[0].currency || DEFAULT_CURRENCY;
    });

    return mergedData;
  }
}
