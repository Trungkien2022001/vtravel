import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { BaseAPIResponseDTO } from 'src/shared/dtos';

export class NearestAirportDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Property Id',
    example: '1941',
  })
  // eslint-disable-next-line camelcase
  property_id: string;

  @IsString()
  // @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Property Type, valid value are [region, hotel]',
    example: 'region',
  })
  // eslint-disable-next-line camelcase
  property_type: string;
}

class NearestAirportnResponse {}

export class NearestAirportnResponseDto extends BaseAPIResponseDTO<NearestAirportnResponse> {}
