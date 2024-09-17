import { ApiResponse } from '@nestjs/swagger';
import { ERROR } from 'src/shared/constants';
import { BaseErrorResponseDto } from 'src/shared/dtos';
const QrnetErrors: Record<any, MethodDecorator & ClassDecorator> = {};
Object.keys(ERROR).map((key: string, index) => {
  const enumKey = key as keyof typeof ERROR;
  const description = ERROR[enumKey];
  QrnetErrors[key] = ApiResponse({
    status: 3000 + index,
    description,
    type: BaseErrorResponseDto,
  });
});

export const QrnetErrorsSwagger = QrnetErrors;
