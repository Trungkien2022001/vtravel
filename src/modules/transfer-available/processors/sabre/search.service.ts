import { Injectable } from '@nestjs/common';
import { TransferSearchDto } from '../../dto';
@Injectable()
export class SabreSearchService {
  async search(body: TransferSearchDto): Promise<any> {
    return 'SabreSearchService';
  }
}
