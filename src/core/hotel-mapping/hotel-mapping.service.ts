import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HotelMappingService {
  constructor(public configService: ConfigService) {}
}
