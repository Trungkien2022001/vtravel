import { RedisService } from 'src/core';
import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import {
  BINARY_AVAIL_ROOM_CHECK,
  REDIS_EXPIRED,
  REDIS_KEY,
} from 'src/shared/constants';
import { SearchByHotelIdsDto, SearchByRegionDto } from '../dto';
import { getBitsArray } from 'src/common';
import * as _ from 'lodash';

@Injectable()
export class SearchService {
  constructor(
    protected readonly entityManager: EntityManager,
    protected readonly redisService: RedisService,
  ) {}

  async findRoomIdsFromRegion(body: SearchByRegionDto): Promise<any[]> {
    const maxAdult = body.rooms[0].adult;
    const maxChildren = body.rooms[0].children;
    const maxInfant = body.rooms[0].infant;
    const binaryAvailRoomCheck = getBitsArray(10, 3);
    const handle = async () => {
      const rows = await this.entityManager.query(`
        select 
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

      return rows.map((r) => r.room_id);
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
}
