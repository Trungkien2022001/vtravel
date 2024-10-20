import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { uuid } from 'src/common';
import * as _ from 'lodash';
import * as crypto from 'crypto';
import { FlightProvider, FlightSession } from 'src/shared';

@Injectable()
export class HelperService {
  hashPassword(password, nonce, created) {
    // eslint-disable-next-line prettier/prettier
    const shasum = crypto.createHash('sha1').update(password).digest();
    const hash2 = crypto
      .createHash('sha1')
      .update(nonce + created)
      .update(shasum);

    return hash2.digest('base64');
  }
  baseSoap(acc: FlightProvider, action: string, session?: FlightSession) {
    const nonce = uuid();
    const nonce64 = Buffer.from(nonce).toString('base64');
    const created = moment.utc().format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');

    const headers = {
      '@xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/',
      'add:MessageID': {
        '#text': uuid(),
        '@xmlns:add': 'http://www.w3.org/2005/08/addressing',
      },
      'add:Action': {
        '#text': `http://webservices.amadeus.com/${action}`,
        '@xmlns:add': 'http://www.w3.org/2005/08/addressing',
      },
      'add:To': {
        '#text': acc.url,
        '@xmlns:add': 'http://www.w3.org/2005/08/addressing',
      },
      'link:TransactionFlowLink': {
        '@xmlns:link': 'http://wsdl.amadeus.com/2010/06/ws/Link_v1',
        'link:Consumer': {
          'link:UniqueID': uuid(),
        },
      },
      'oas:Security': {
        '@xmlns:oas':
          'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd',
        'oas:UsernameToken': {
          '@xmlns:oas1':
            'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd',
          '@oas1:Id': 'UsernameToken-1',
          'oas:Username': acc.username,
          'oas:Nonce': {
            '#text': nonce64,
            '@EncodingType':
              'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary',
          },
          'oas:Password': {
            '#text': this.hashPassword(acc.password, nonce, created),
            '@Type':
              'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordDigest',
          },
          'oas1:Created': created,
        },
      },
      AMA_SecurityHostedUser: {
        '@xmlns': 'http://xml.amadeus.com/2010/06/Security_v1',
        UserID: {
          '@POS_Type': '1',
          '@PseudoCityCode': acc.agency_code,
          '@AgentDutyCode': 'SU',
          '@RequestorType': 'U',
        },
      },
    };

    const transaction = _.get(session, 'awsse:Session.@TransactionStatusCode');
    if (['InSeries', 'End'].includes(transaction)) {
      delete headers['oas:Security'];
      delete headers.AMA_SecurityHostedUser.UserID;
    }

    return {
      'soapenv:Envelope': {
        '@xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
        '@xmlns:sec': 'http://xml.amadeus.com/2010/06/Security_v1',
        '@xmlns:typ': 'http://xml.amadeus.com/2010/06/Types_v1',
        '@xmlns:iat': 'http://www.iata.org/IATA/2007/00/IATA2010.1',
        '@xmlns:app': 'http://xml.amadeus.com/2010/06/AppMdw_CommonTypes_v3',
        '@xmlns:link': 'http://wsdl.amadeus.com/2010/06/ws/Link_v1',
        '@xmlns:ses': 'http://xml.amadeus.com/2010/06/Session_v3',
        'soapenv:Header': { ...session, ...headers },
        'soapenv:Body': {},
      },
    };
  }
}
