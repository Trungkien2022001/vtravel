import { RedisService } from './../cache/redis/redis.service';
import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  HOTEL_MAPPING_COLUMNS,
  REDIS_EXPIRED,
  REDIS_KEY,
} from 'src/shared/constants';
import { SearchByRegionDto } from 'src/modules/hotel-available/dto';

@Injectable()
export class HotelMappingService {
  constructor(
    private readonly configService: ConfigService,
    private readonly entityManager: EntityManager,
    private readonly redisService: RedisService,
  ) {}
  async findHotelIdsFromRegion(regionId: string): Promise<string[]> {
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

  async findHotelMappingsV2(hotelIds, supplierCode, isUseEpsIds = true) {
    const supplierHotelColumn = HOTEL_MAPPING_COLUMNS[supplierCode];
    const columnToCheck = isUseEpsIds ? 'hotel_id' : supplierHotelColumn;
    if (!supplierHotelColumn) {
      throw new Error(
        `Hotel Booking V2 doesn't support supplier ${supplierCode}`,
      );
    }

    const mappings = await this.entityManager.query(`
      SELECT hotel_id, ${supplierHotelColumn} as supplier_hotel_id
      FROM hotel_mapping_provider
      WHERE hotel_id IS NOT NULL
      AND ${columnToCheck} IS NOT NULL
      AND ${columnToCheck} IN (${hotelIds.map((id) => `'${id}'`).join(', ')})
    `);

    return mappings.map((i) => ({
      e: i.hotel_id,
      s: i.supplier_hotel_id,
    }));
  }

  async findSupplierHotelsFromRegions(req: SearchByRegionDto, supplierCode) {
    const supplierHotelColumn = HOTEL_MAPPING_COLUMNS[supplierCode];
    if (!supplierHotelColumn) {
      throw new Error(
        `Hotel Booking V2 doesn't support supplier ${supplierCode}`,
      );
    }
    const ids = await this.redisService.cachedExecute(
      {
        key: `${REDIS_KEY.HOTEL_PROVIDER}:${supplierCode}:${req.region_id}`,
        ttl: REDIS_EXPIRED['1_WEEKS'],
        json: true,
      },
      async () => {
        const hotelIds = await this.entityManager.query(`
          SELECT hm.region_id, hm.hotel_id, hmp.${supplierHotelColumn} as supplier_hotel_id
          FROM hotel_mapping_provider as hmp
          INNER JOIN hotel_mapping as hm ON hm.hotel_id = hmp.hotel_id
          WHERE hm.region_id IN (${req.region_id})
          AND hmp.${supplierHotelColumn} <> ''
        `);

        return hotelIds.map((i) => ({
          e: i.hotel_id,
          s: i.supplier_hotel_id,
        }));
      },
    );

    return ids;
  }

  getSupplierIds(mappings) {
    return mappings.map((i) => i.s);
  }

  buildObjectMappings(ids) {
    const mappings = {};
    // eslint-disable-next-line array-callback-return
    ids.map((id) => {
      mappings[id.s] = id.e;
    });

    return mappings;
  }
  appendEpsMapping(hotels, mappings) {
    const objMappings = this.buildObjectMappings(mappings);

    return hotels.map((hotel) => ({
      ...hotel,
      eps_id: objMappings[hotel.hotel_id],
    }));
  }
}
