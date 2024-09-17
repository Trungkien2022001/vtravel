import { applyDecorators } from '@nestjs/common';
import { StandardErrorsSwagger } from '../helpers/swaggers';
import { TStandardError } from 'src/shared/types';

export function StandardAPIErrorResponse(types?: TStandardError[]) {
  let decorators: any[];
  if (!types) {
    decorators = Object.keys(StandardErrorsSwagger).map(
      (key) =>
        StandardErrorsSwagger[
          key as unknown as keyof typeof StandardErrorsSwagger
        ],
    );
  } else {
    decorators = types
      .map(
        (type) =>
          StandardErrorsSwagger[
            type as unknown as keyof typeof StandardErrorsSwagger
          ],
      )
      .filter((decorator) => decorator !== null);
  }

  return applyDecorators(...decorators);
}
