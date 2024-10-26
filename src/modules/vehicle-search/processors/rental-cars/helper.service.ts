import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { AppDataError, AppError, uuid } from 'src/common';
import * as _ from 'lodash';
import * as crypto from 'crypto';
import { HttpService } from '@nestjs/axios';
import { ProviderLogger } from 'src/common/logger';
import { ERROR, SEARCH_ERROR } from 'src/shared/constants';

@Injectable()
export class HelperService {
  action2Endpoint = {
    availability: 'availability',
    confirm: 'bookings',
    cancel: 'bookings',
  };
  constructor(
    private readonly httpService: HttpService,
    private readonly providerLogger: ProviderLogger,
  ) {}

  async createSignature(privateKey, publicKey) {
    const utcDate = Math.floor(new Date().getTime() / 1000);
    const assemble = publicKey + privateKey + utcDate;
    const hash = crypto.createHash('sha256');

    return hash.update(assemble).digest('hex');
  }

  buildUrl(domain, action) {
    if (
      !domain ||
      !action ||
      !Object.keys(this.action2Endpoint).includes(action)
    )
      throw new AppError(SEARCH_ERROR.INVALID_REQUEST);

    let url = domain;
    if (url[url.length - 1] !== '/') url += '/';
    url += this.action2Endpoint[action];

    return url;
  }

  async getAsync(url, credential) {
    const signature = await this.createSignature(
      credential.shared_secret,
      credential.api_key,
    );
    // const { status, body } = await request.getAsync(url, {
    //   json: true,
    //   headers: {
    //     'Api-Key': credential.api_key,
    //     'X-Signature': signature,
    //   },
    // });
    const opts = {
      headers: {
        'Api-Key': credential.api_key,
        'X-Signature': signature,
      },
    };
    let statusCode: number;
    let body: string;
    try {
      const response = await this.httpService
        .get(url, { headers: opts.headers })
        .toPromise();
      statusCode = response.status;
      body = response.data;
    } catch (error) {
      // Handle error accordingl
      statusCode = error.status;
      body = error.response.data;
    }

    if (statusCode < 200 || statusCode > 299)
      throw new AppDataError(SEARCH_ERROR.PROVIDER_ERROR, body);

    return body;
  }
}
