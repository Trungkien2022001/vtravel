import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { TransferSearchDto } from '../../dto';
import { AppError } from 'src/common';
import { SEARCH_ERROR } from 'src/shared/constants';
@Injectable()
export class BaseTransferSearchProcessor {
  constructor(protected readonly entityManager: EntityManager) {}
  async search(body: TransferSearchDto, agentId: number) {
    throw new AppError(SEARCH_ERROR.METHOD_NOT_IMPLEMENT);
  }

  async mapAirport2ProviderCity(airportCode, providerCode) {
    const rows = await this.entityManager.query(
      `
        SELECT cmt.*, airport.country_code
        FROM city_mapping_transfer cmt
        INNER JOIN airport ON airport.airport_code = cmt.airport_code
        WHERE cmt.airport_code = $1 
          AND cmt.del_flag = 0
          AND cmt.provider_code = $2
      `,
      [airportCode, providerCode],
    );
    if (!rows.length) {
      throw new AppError(SEARCH_ERROR.INVALID_REQUEST);
    }

    return rows[0];
  }

  async getProviderLanguage(langReq, providerCode) {
    const languageCode = langReq ? [langReq, 'en-us'] : ['en-us'];
    const rows = await this.entityManager.query(`
      select * from languages where culture_code in (${languageCode.map((lang) => `'${lang}'`).join(',')})`);

    const language = rows.filter(
      (lang) =>
        lang.culture_code.toLowerCase() ===
        (langReq ? langReq.toLowerCase() : 'en-us'),
    );

    if (language.length && language[0][providerCode.toLowerCase()]) {
      return language[0];
    } else {
      return rows.filter(
        (lang) => lang.culture_code.toLowerCase() === 'en-us',
      )[0];
    }
  }
}
