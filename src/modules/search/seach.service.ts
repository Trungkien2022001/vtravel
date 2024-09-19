import { SearchByAirportCodeDto } from './dto/search-by-airport-code.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SearchService {
  constructor() {}

  async SearchByAirportCode(body: SearchByAirportCodeDto) {
    return body;
  }
}
