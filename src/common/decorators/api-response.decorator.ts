import { applyDecorators } from '@nestjs/common';
import { AppErrorsSwagger } from '../helpers/swaggers';
import { TCustomError } from 'src/shared/types';

export function CustomAPIErrorResponse(types: TCustomError[]) {
  let decorators: any;
  if (types.length) {
    decorators = types.map((key) => AppErrorsSwagger[key]).filter((d) => d);

    return applyDecorators(...decorators);
  } else {
    return applyDecorators();
  }
}
