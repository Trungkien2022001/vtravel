/* eslint-disable camelcase */
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { BaseAPIResponseDTO, BaseFlightSeachRequestDto } from 'src/shared/dtos';

export class FlightSearchDto extends BaseFlightSeachRequestDto {
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Departure Airport Code',
    example: 'HAN',
  })
  departure_airport_code: string;

  @IsString()
  @ApiProperty({
    type: String,
    description: 'Arrival Airport Code',
    example: 'SGN',
  })
  arrival_airport_code: string;
}

class FlightSearchResponse {}

export class FlightSearchResponseDto extends BaseAPIResponseDTO<FlightSearchResponse> {}
