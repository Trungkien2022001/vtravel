import { ProductType } from '../constants';

export interface IProviderLog {
  product: ProductType;
  body: any;
  request: any;
  response: any;
  statusCode: number;
  userId: number;
}
