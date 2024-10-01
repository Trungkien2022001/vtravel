import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { BaseAPIResponseDTO } from 'src/shared/dtos';

export class BasicInsuranceRateDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({
    type: String,
    description: 'Region Id',
    example: '1941',
  })
  // eslint-disable-next-line camelcase
  text: string;
}

class BasicInsuranceRateResponse {}

export class BasicInsuranceRateResponseDto extends BaseAPIResponseDTO<BasicInsuranceRateResponse> {}
