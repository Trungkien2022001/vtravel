/* eslint-disable camelcase */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { BaseAPIResponseDTO } from 'src/shared/dtos';

export class CreateAdminAccountDto {
  @ApiProperty({
    required: true,
    type: String,
    example: 'trungkien07yd@gmail.com',
    description: 'Username',
    minLength: 4,
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(200)
  username: string;

  @ApiProperty({
    required: true,
    type: String,
    example: 'trungkien',
    description: 'User password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    required: true,
    type: [Number],
    example: [1, 2, 3],
    description: 'List of role ids',
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  role_ids: number[];
}

class CreateAdminAccountResponse {
  @ApiProperty({
    required: true,
    type: String,
    example: 'Create New admin successfully',
  })
  token: string;
}

export class CreateAdminAccountResponseDto extends BaseAPIResponseDTO<CreateAdminAccountResponse> {
  @ApiProperty({
    required: true,
    type: CreateAdminAccountResponse,
    description: 'Detail response!',
  })
  data: CreateAdminAccountResponse;
}
