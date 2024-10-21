import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AgentEntity,
  HotelRateCrawlerEntity,
  RoomRateEntity,
} from 'src/core/database/entities';
import { EntityManager } from 'typeorm';
import { ElasticSearchService, RedisService } from 'src/core';
import * as crypto from 'crypto';
import * as _ from 'lodash';
import { HttpService } from '@nestjs/axios';
import { RoomRateRepository } from 'src/core/database/repositories';
import { HotelRateCrawlerRepository } from 'src/core/database/repositories/hotel-rate-crawler.repository';

// ping.dto.ts
export interface EpsContentRequestDto {
  checkin: string;
  checkout: string;
  country_code?: string;
  currency?: string;
  language?: string;
  occupancy?: number;
  rate_plan_count?: number;
  sales_channel?: string;
  sales_environment?: string;
  include?: string;
  property_id: number;
}

@Injectable()
export class CrawlerService {
  constructor(
    @InjectRepository(AgentEntity)
    private readonly entityManager: EntityManager,
    private readonly redisService: RedisService,
    private readonly elasticSearchService: ElasticSearchService,
    private readonly httpService: HttpService,
    @InjectRepository(RoomRateEntity)
    private readonly roomRateRepository: RoomRateRepository,
    @InjectRepository(HotelRateCrawlerEntity)
    private readonly hotelRateCrawlerRepository: HotelRateCrawlerRepository,
  ) {}

  async crawlerHotel() {
    const hotels = await this.entityManager.query(`
        SELECT hotel_id from hotel_info where country_code <> 'VN'  
    `);
    const cnk = _.chunk(hotels, 50);
    for (let index = 4969; index < cnk.length; index++) {
      const chunk = cnk[index];
      await Promise.all(
        chunk.map(async (h) => {
          const req: EpsContentRequestDto = {
            checkin: '2024-12-12',
            checkout: '2024-12-13',
            country_code: 'US',
            currency: 'USD',
            language: 'en-US',
            occupancy: 2,
            rate_plan_count: 250,
            sales_channel: 'website',
            sales_environment: 'hotel_only',
            include: 'all_rates',
            property_id: h.hotel_id,
          };
          const hotel = await this.ping(req);

          await this.transformRate(hotel);
        }),
      );
      Logger.log(index);
    }
    Logger.log('Crawler successfully!');
  }

  async ping(req: EpsContentRequestDto) {
    const token = this.generateSignature();
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      // eslint-disable-next-line max-len
      url: `https://api.ean.com/v3/properties/availability?checkin=${req.checkin}&checkout=${req.checkout}&country_code=${req.country_code || 'US'}&currency=${req.currency || 'USD'}&language=${req.language || 'en-US'}&occupancy=${req.occupancy || 2}&rate_plan_count=${req.rate_plan_count || 100}&sales_channel=${req.sales_channel || 'website'}&sales_environment=${req.sales_environment || 'hotel_only'}&include=${req.include || 'all_rates'}&property_id=${req.property_id}`,
      headers: {
        Authorization: token,
        'Customer-Ip': '5.5.5.5',
        Accept: 'application/json',
        'Accept-Encoding': 'gzip',
      },
    };

    try {
      const response = await this.httpService.request(config).toPromise();

      return response.data; // Trả về dữ liệu từ API EAN
    } catch (error) {
      throw new Error(`Failed to ping EAN API: ${error.message}`);
    }
  }

  generateSignature() {
    const apiKey = process.env.EPS_API_KEY;
    const secret = process.env.EPS_SHARED_SECRET;
    const timestamp = Math.round(new Date().getTime() / 1000);
    const hash = crypto
      .createHash('sha512')
      .update(apiKey + secret + timestamp)
      .digest('hex');

    return `EAN APIKey=${apiKey},Signature=${hash},timestamp=${timestamp}`;
  }

  async transformRate(data) {
    const hotel = data[0];
    if (!hotel || !hotel.property_id) {
      return;
    }
    const hotelId = hotel.property_id;
    const rates = [];
    const promises = [];
    const statistics = [];
    for (let index = 0; index < hotel.rooms.length; index++) {
      const room = hotel.rooms[index];
      let remain = 0;
      for (let idx = 0; idx < room.rates.length; idx++) {
        try {
          const rate = room.rates[idx];
          const rateName = rate.amenities
            ? Object.values(rate.amenities)
                .map((a) => (a as any).name)
                .join('@@@')
            : 'NO NAME';
          const ratePrice =
            rate.occupancy_pricing &&
            (Object.values(rate.occupancy_pricing)[0] as any);
          // let promotions = Object.values(rate.promotions);
          // if (promotions) {
          //   promotions = Object.values(promotions);
          // }
          if (!ratePrice) {
            continue;
          }
          const price =
            ratePrice.totals.property_inclusive.request_currency.value;
          const currency =
            ratePrice.totals.property_inclusive.request_currency.currency;
          const rateInfo = {
            hotelId,
            roomId: room.id,
            rateCode: rate.id,
            rateName: rateName,
            refundable: rate.refundable,
            fullRate: price,
            currency,
            promotions: rate.promotions,
            cancellationPolicies: rate.cancel_penalties.map((c) => ({
              percent: c.percent,
              currency: c.currency,
              amount: c.amount,
            })),
            priceMetadata: ratePrice,
            remain: rate.available_rooms,
          };
          remain = rate.remain;
          rates.push(rateInfo);
        } catch (error) {
          Logger.error(error);
        }
      }
      statistics.push({
        hotelId: hotelId,
        roomId: room.id,
        numOfRate: room.rates.length,
        remain,
      });
    }
    try {
      promises.push(this.hotelRateCrawlerRepository.insert(statistics));
      promises.push(this.roomRateRepository.insert(rates));
      await Promise.all(promises);
      Logger.log(`Hotel Id: ${hotelId}, Total Rates: ${rates.length}`);
    } catch (error) {
      Logger.error(error);
    }
  }
}
