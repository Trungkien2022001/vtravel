import { IBaseContract } from './base.contract';

export interface IRole extends IBaseContract {
  name: string;
  description?: string;
  normalize_name?: string;
}
