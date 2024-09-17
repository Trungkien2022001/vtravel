import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  BadRequestResponseDto,
  ForbiddenResponseDto,
  InternalServerErrorlResponseDto,
  UnauthorizedResponseDto,
} from 'src/shared/dtos';
import { EStandardError } from 'src/shared/enums';

export const StandardErrorsSwagger = {
  [EStandardError.UNAUTHORIZED]: ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized',
    type: UnauthorizedResponseDto,
  }),
  [EStandardError.FORBIDDEN]: ApiForbiddenResponse({
    status: 403,
    description: 'Forbidden',
    type: ForbiddenResponseDto,
  }),
  [EStandardError.INTERNAL_SERVER_ERROR]: ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal Server Error',
    type: InternalServerErrorlResponseDto,
  }),
  [EStandardError.BAD_REQUEST]: ApiBadRequestResponse({
    status: 400, // HTTP 400 cho Bad Request
    description: 'Bad Request',
    type: BadRequestResponseDto,
  }),
};
