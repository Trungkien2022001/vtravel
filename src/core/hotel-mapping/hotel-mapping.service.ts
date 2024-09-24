import { RedisService } from './../cache/redis/redis.service';
import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REDIS_EXPIRED, REDIS_KEY } from 'src/shared/constants';

@Injectable()
export class HotelMappingService {
  constructor(
    private readonly configService: ConfigService,
    private readonly entityManager: EntityManager,
    private readonly redisService: RedisService,
  ) {}
  async findRoomIdsFromRegion(regionId: string): Promise<string[]> {
    const hotelIds = await this.redisService.cachedExecute(
      {
        key: `${REDIS_KEY.HOTEL_IDS_FROM_REGION}:${regionId}`,
        ttl: REDIS_EXPIRED['1_WEEKS'],
      },
      async () => {
        const rows = await this.entityManager.query(
          `
          SELECT
            hotel_id
          FROM hotel_mapping hm
          where 
            hm.region_id = $1
            and hm.is_active = true
          `,
          [regionId],
        );

        return rows.map((r) => r.hotel_id);
      },
    );

    return hotelIds;
  }
}
