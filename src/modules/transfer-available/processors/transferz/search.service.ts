import { Injectable } from '@nestjs/common';
import { TransferSearchDto } from '../../dto';
@Injectable()
export class TransferzSearchService {
  async search(body: TransferSearchDto): Promise<any> {
    return 'TransferzSearchService';
  }
}
