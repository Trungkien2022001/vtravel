import { Injectable } from '@nestjs/common';
import { FlightSearchDto } from '../../dto';
@Injectable()
export class BaseFlightSearchProcessor {
  async search(body: FlightSearchDto) {
    return 'BaseFlightSearchProcessor';
  }
}
