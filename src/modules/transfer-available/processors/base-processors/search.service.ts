import { Injectable } from '@nestjs/common';
import { TransferSearchDto } from '../../dto';
@Injectable()
export class BaseTransferSearchProcessor {
  async search(body: TransferSearchDto) {
    return 'BaseTransferSearchProcessor';
  }
}
