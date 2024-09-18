import { IBaseContract } from './base-entity.interface';
import { IRole } from './role.interface';

export interface IUser extends IBaseContract {
  username: string;
  password_hash?: string;
  roles: Pick<IRole, 'id' | 'name'>[];
}

export interface IAdmin extends IBaseContract {
  data: any;
  username: string;
  password_hash?: string;
  roles: Pick<IRole, 'id' | 'name'>[];
}
