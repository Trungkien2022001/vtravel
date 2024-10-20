import { AvailableService } from '../../hotel-available/service/seach.service';
import { EntityManager } from 'typeorm';
import { ElasticSearchService, RedisService } from 'src/core';
import { Injectable } from '@nestjs/common';
import { SearchByRegionDto } from 'src/modules/hotel-available/dto';
import { REDIS_EXPIRED, REDIS_KEY, REGION_TYPE } from 'src/shared/constants';
import * as unidecode from 'unidecode';
import * as _ from 'lodash';
import { tryParseJson } from 'src/common';

@Injectable()
export class DataCenterService {
  constructor(
    private readonly elasticSearchService: ElasticSearchService,
    private readonly redisService: RedisService,
    private readonly entityManager: EntityManager,
    private readonly availableService: AvailableService,
  ) {}

  async searchByRegion(body: SearchByRegionDto) {
    const hotels = await this.availableService.findActiveHotelIds(body);
    const hotelIds = hotels.map((h) => h.hotel_id);

    return this.elasticSearchService.findHotelByHotelIds(hotelIds);
  }

  async getParentRegion(regionId: string, priorityRegionType?: string) {
    const esData: any[] =
      await this.elasticSearchService.findRegionById(regionId);
    if (!esData.length) {
      return;
    }
    const ancestorRegions = tryParseJson(esData[0].ancestors);
    const priorityOrder = ['city', 'multi_city_vicinity', 'province_state'];
    if (priorityRegionType) {
      return ancestorRegions?.find((item) => item.type === priorityRegionType);
    }
    for (const type of priorityOrder) {
      const region = ancestorRegions?.find((item) => item.type === type);
      if (region) {
        return region;
      }
    }
  }

  getDescendantRegionIds(region) {
    const descendantRegions = tryParseJson(region?.descendants);
    if (!descendantRegions) {
      return [];
    }

    return _.flatten(Object.values(descendantRegions));
  }

  async getRegionDetail(regionId: string) {
    const esData: any[] =
      await this.elasticSearchService.findRegionById(regionId);
    if (!esData.length) {
      return;
    }
    const region: any = esData[0];
    // let regionIds
    const priorityRegionType = REGION_TYPE.CITY;

    // if(region.region_type === REGION_TYPE.PROVINCE_STATE){
    //   const ancestorRegions = tryParseJson(region.ancestors);
    //   const multiCityVicinityRegion = ancestorRegions.find(r=>r.type ===priorityRegionType)
    //   if(!multiCityVicinityRegion){
    //     return
    //   }
    //   const [ multiCityVicinityRegionDetail ] =  await this.elasticSearchService.findRegionById(multiCityVicinityRegion.id);
    //   regionIds = this.getDescendantRegionIds(multiCityVicinityRegionDetail)

    // } else {
    const regionIds = this.getDescendantRegionIds(region);
    // }
    if (!regionIds) {
      return;
    }
    const regions = await this.elasticSearchService.findRegionByIds(regionIds);
    const subRegionIds = _(regions.map((r) => this.getDescendantRegionIds(r)))
      .flatten()
      .uniq()
      .value();

    let allRegions =
      await this.elasticSearchService.findRegionByIds(subRegionIds);
    allRegions = allRegions.concat(regions).map((r) => ({
      region_id: r.region_id,
      region_name: r.region_name,
      region_name_full: r.region_name_full,
      region_type: r.region_type,
      longitude: r.center_longitude,
      latitude: r.center_latitude,
    }));
    const cities = [];
    const pointOfInterests = [];
    const neighborhoods = [];
    const trainStations = [];
    const metroStations = [];
    for (let index = 0; index < allRegions.length; index++) {
      const reg = allRegions[index];
      switch (reg.region_type) {
        case REGION_TYPE.CITY:
          cities.push(reg);
          break;

        case REGION_TYPE.POINT_OF_INTEREST:
          pointOfInterests.push(reg);
          break;

        case REGION_TYPE.NEIGHBOORHOOD:
          neighborhoods.push(reg);
          break;

        case REGION_TYPE.TRAIN_STATION:
          trainStations.push(reg);
          break;

        case REGION_TYPE.METRO_STATION:
          metroStations.push(reg);
          break;

        default:
          break;
      }
    }

    return {
      statistic: {
        cities: cities.length,
        pointOfInterests: pointOfInterests.length,
        neighborhoods: neighborhoods.length,
        trainStations: trainStations.length,
        metroStations: metroStations.length,
      },
      cities,
      pointOfInterests,
      neighborhoods,
      trainStations,
      metroStations,
      region,
    };
  }

  async getConvertCurrency(c1: string, c2: string) {
    const pair = c1 + c2;
    const rate = await this.redisService.cachedExecute(
      {
        key: `${REDIS_KEY.CURRENCY}:${pair}`,
        ttl: REDIS_EXPIRED['1_DAYS'],
      },
      async () => {
        const pairs = await this.entityManager.query(`
          SELECT pair, rate
          FROM convert_currency
          WHERE pair = '${pair}'
          and is_deleted = false`);

        return pairs[0];
      },
    );

    return rate;
  }
  async getConvertCurrencies(destCurrency: string, currencies: string[]) {
    const pairs = currencies.map((c) => `${c}${destCurrency}`);
    const rates = await this.redisService.cachedExecute(
      {
        key: `${REDIS_KEY.CURRENCIES}:${currencies.map((c) => `${c}${destCurrency}`).join(',')}`,
        ttl: REDIS_EXPIRED['1_DAYS'],
      },
      async () => {
        const pair = await this.entityManager.query(`
          SELECT pair, rate
          FROM convert_currency
          WHERE pair in (${pairs.map((p) => `'${p}'`).join(',')})
           and is_deleted = false`);
        const objPair = {};
        pair.map((p) => {
          objPair[p.pair] = p.rate;
        });

        return objPair;
      },
    );

    return rates;
  }
  async getHotelPlaceHolderSuggested(text: string) {
    const queryPhrase = unidecode(text);
    const [airports, hotels, regions] = await Promise.all([
      await this.elasticSearchService.getAirportsFromName(queryPhrase),
      await this.elasticSearchService.getHotelsFromName(queryPhrase),
      await this.elasticSearchService.getRegionsFromName(queryPhrase),
    ]);

    return {
      statistic: {
        airports: airports.length,
        regions: regions.length,
        hotels: hotels.length,
      },
      airports,
      regions,
      hotels,
    };
  }
}
