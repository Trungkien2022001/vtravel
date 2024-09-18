import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from 'src/shared/constants';
import { ERoles } from 'src/shared/enums';

export const Roles = (...roles: ERoles[]): CustomDecorator =>
  SetMetadata(ROLES_KEY, roles);
