import { IBaseContract } from './base-entity.interface';

export interface IRole extends IBaseContract {
  name: string;
  description?: string;
  normalize_name?: string;
}
