import { applyDecorators } from '@nestjs/common';
import { ApiHeaders } from '@nestjs/swagger';
import { REQUEST_HEADERS } from 'src/shared/constants';
import { TRequestHeader } from 'src/shared/types';

interface HeaderOption {
  name: string;
  require: boolean;
  schema: object;
}

export function AppStandardApiHeaders(...headers: TRequestHeader[]) {
  const headerOptions = headers
    .map((header) => {
      switch (header.toLowerCase()) {
        case REQUEST_HEADERS['X-ACCESS-TOKEN']:
          return {
            name: REQUEST_HEADERS['X-ACCESS-TOKEN'],
            required: true,
            schema: { type: 'string' },
          };
        case REQUEST_HEADERS['X-KEY']:
          return {
            name: REQUEST_HEADERS['X-KEY'],
            required: false,
            schema: { type: 'string' },
          };
        case REQUEST_HEADERS['X-VERSION']:
          return {
            name: REQUEST_HEADERS['X-VERSION'],
            required: false,
            schema: { type: 'string' },
          };
        case REQUEST_HEADERS['X-LANG']:
          return {
            name: REQUEST_HEADERS['X-LANG'],
            required: true,
            schema: { type: 'string' },
          };
        default:
          return;
      }
    })
    .filter((i) => i) as unknown as HeaderOption[];

  return applyDecorators(ApiHeaders(headerOptions));
}
