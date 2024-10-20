import { Injectable } from '@nestjs/common';
import { FlightSearchDto } from '../../dto';
@Injectable()
export class SabreSearchService {
  async search(body: FlightSearchDto): Promise<any> {
    return 'SabreSearchService';
  }
}
