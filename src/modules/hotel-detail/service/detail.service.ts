import { RedisService, ElasticSearchService } from 'src/core';
import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { HotelDetailDto } from '../dto';
import {
  BINARY_AVAIL_ROOM_CHECK,
  REDIS_EXPIRED,
  REDIS_KEY,
} from 'src/shared/constants';
import {
  buildHotelDetailCacheKey,
  getBitsArray,
  getMaxNumOfPaxes,
} from 'src/common';

import * as _ from 'lodash';

@Injectable()
export class HotelDetailService {
  constructor(
    protected readonly entityManager: EntityManager,
    protected readonly redisService: RedisService,
    private readonly elasticSearchService: ElasticSearchService,
  ) {}

  async getHotelDetail(body: HotelDetailDto) {
    const hotels = await this.findAvailableRoom(body);
    const { hotel_id: hotelId, room_ids: roomIds } = hotels;
    const rates = await this.findAllRate(roomIds, body);
    const [hotelInfo, roomsInfo] = await Promise.all([
      await this.elasticSearchService.getHotelInfo(hotelId),
      await this.elasticSearchService.getRoomsInfo(roomIds),
    ]);
    const rooms = this.mergeRoomInfo(roomsInfo, rates);

    return {
      ...(hotelInfo as any),
      rooms,
    };
  }
  async findAvailableRoom(body: HotelDetailDto) {
    const { maxAdult, maxChildren, maxInfant } = getMaxNumOfPaxes(body.rooms);

    const numOfRooms = body.rooms.length;
    const binaryAvailRoomCheck = getBitsArray(10, 3);
    const redisKey = buildHotelDetailCacheKey(body);

    const handle = async () => {
      const rows = await this.entityManager.query(`
        select 
          rc.hotel_id,
          rc.room_id
        from room_control rc 
        where rc.hotel_id = '${body.hotel_id}'
          and rc.max_adult >= ${maxAdult}
          and rc.max_children >= ${maxChildren}
          and rc.max_infant >= ${maxInfant}
          and rc.availability & B'${binaryAvailRoomCheck}' = ${BINARY_AVAIL_ROOM_CHECK}
    `);

      const hotels = _(rows)
        .groupBy('hotel_id')
        .map((items, hotelId) => ({
          // eslint-disable-next-line camelcase
          hotel_id: hotelId,
          // eslint-disable-next-line camelcase
          room_ids: items.map((i) => i.room_id),
        }))
        .filter((h) => h.room_ids.length >= numOfRooms)
        .value();

      return hotels[0];
    };
    const hotels = await this.redisService.cachedExecute(
      {
        key: `${REDIS_KEY.HOTEL_AVAIL_RATE}:${redisKey}`,
        ttl: REDIS_EXPIRED['1_DAYS'],
      },
      handle,
    );

    return hotels;
  }

  async findAllRate(roomIds: string[], body: HotelDetailDto) {
    const handle = async () => {
      const rows = await this.entityManager.query(`
      select 
        rr.id,
        rr.room_id ,
        rr.rate_code ,
        rr.rate_name ,
        rr.full_rate ,
        rr.currency ,
        rr.is_has_extra_bed ,
        rr.extra_bed_rate,
        rr.extra_children,
        rr.extra_infant ,
        rr.cancellation_policies ,
        rr.tax ,
        rr.fee 
      from room_rate_v2 rr
      where rr.room_id in (${roomIds.map((id) => `'${id}'`).join(',')})
        and rr.is_active = true 
        and rr.is_deleted = false
    `);

      return rows;
      // return _(rows).groupBy('room_id').value();
      // .map((items, roomId) => ({
      //   // eslint-disable-next-line camelcase
      //   room_id: roomId,
      //   // eslint-disable-next-line camelcase
      //   rates: items,
      // }));
    };
    const hotels = await this.redisService.cachedExecute(
      {
        key: `${REDIS_KEY.HOTEL_AVAIL_RATE}:${roomIds.join(',')}`,
        ttl: REDIS_EXPIRED['1_DAYS'],
      },
      handle,
    );

    return hotels;
  }

  mergeRoomInfo(roomsInfo: any[], rates: any[]) {
    const objRates = _.groupBy(rates, 'room_id');

    return roomsInfo.map((room) => ({
      ...room,
      rate: objRates[room.room_id],
    }));
  }
}
