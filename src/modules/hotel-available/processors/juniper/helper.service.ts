import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { HotelProvider } from 'src/shared';
import { HttpService } from '@nestjs/axios';
import { ProviderLogger } from 'src/common/logger';

@Injectable()
export class HelperService {
  constructor(
    private readonly httpService: HttpService,
    private readonly providerLogger: ProviderLogger,
  ) {}

  async sendRequest(req: any, xml: string, acc: HotelProvider, action: string) {
    const opts = {
      headers: {
        'Content-Type': 'text/xml;charset=utf8',
        SOAPAction: `http://webservices.Juniper.com/${action}`,
      },
      data: xml, // Use 'data' instead of 'body' for axios
    };
    let statusCode: number;
    let body: string;
    try {
      const response = await this.httpService
        .post(acc.url, opts.data, { headers: opts.headers })
        .toPromise();
      statusCode = response.status;
      body = response.data;
    } catch (error) {
      // Handle error accordingl
      statusCode = error.status;
      body = error.response.data;
    }
    this.providerLogger.log({
      product: 'HOTEL',
      body: req,
      request: xml,
      response: body,
      userId: req.agentId,
      statusCode: statusCode,
    });

    return body;
  }
}
