import { Injectable } from '@nestjs/common';
import { SearchByRegionDto } from '../../dto';
@Injectable()
export class HotelbedsSearchService {
  async search(body: SearchByRegionDto): Promise<any> {
    return 'HotelbedsSearchService';
  }
}
