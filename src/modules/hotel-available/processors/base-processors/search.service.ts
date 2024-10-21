import { Injectable } from '@nestjs/common';
import { SearchByRegionDto } from '../../dto';
@Injectable()
export class BaseHotelSearchProcessor {
  async search(body: SearchByRegionDto) {
    return 'BaseHotelSearchProcessor';
  }
}
