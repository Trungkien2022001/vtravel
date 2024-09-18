/* eslint-disable @typescript-eslint/naming-convention */
export const REQUEST_HEADERS = {
  'X-VERSION': 'x-version',
  'X-KEY': 'x-key',
  'X-LANG': 'x-lang',
  'X-ACCESS-TOKEN': 'x-access-token',
};

export const REQUEST_QUERIES = {
  PAGE: 'page',
  PAGE_SIZE: 'page_size',
  STATUS: 'status',
  TYPE: 'type',
};

export const JWT_ERROR = {
  TOKEN_EXPIRED: 'TokenExpiredError',
  INVALID_TOKEN: 'JsonWebTokenError',
  NOT_BEFORE: 'NotBeforeError',
};
