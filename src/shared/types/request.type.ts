import { REQUEST_HEADERS, REQUEST_QUERIES } from '../constants';

export type TRequestHeader = keyof typeof REQUEST_HEADERS;
export type TRequestQuery = keyof typeof REQUEST_QUERIES;
