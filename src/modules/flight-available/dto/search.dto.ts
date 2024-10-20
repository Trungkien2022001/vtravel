/* eslint-disable camelcase */
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { IsDateOnly } from 'src/common/decorators';
import {
  MAX_MULTI_CITY_ALLOWED,
  MIN_MULTI_CITY_ALLOWED,
} from 'src/shared/constants';
import { BaseAPIResponseDTO, BaseFlightSeachRequestDto } from 'src/shared/dtos';

export class MultiCitySearchRequestDto {
  @IsString()
  @Length(3)
  @ApiProperty({
    type: String,
    description: 'Departure Airport Code',
    example: 'HAN',
  })
  departure_airport_code: string;

  @IsString()
  @Length(3)
  @ApiProperty({
    type: String,
    description: 'Arrival Airport Code',
    example: 'SGN',
  })
  arrival_airport_code: string;

  @IsString()
  @IsDateOnly()
  @ApiProperty({
    type: String,
    description: 'Departure Date',
    example: '2026-02-20',
  })
  departure_date: string;
}
export class FlightSearchDto extends BaseFlightSeachRequestDto {
  @IsString()
  @Length(3)
  @ApiProperty({
    type: String,
    description: 'Departure Airport Code',
    example: 'HAN',
  })
  departure_airport_code: string;

  @IsString()
  @Length(3)
  @ApiProperty({
    type: String,
    description: 'Arrival Airport Code',
    example: 'SGN',
  })
  arrival_airport_code: string;

  @ValidateNested({ each: true })
  @Type(() => MultiCitySearchRequestDto)
  @ApiProperty({
    type: [MultiCitySearchRequestDto],
    description: 'Number of rooms!',
  })
  @IsOptional()
  @ArrayMinSize(MIN_MULTI_CITY_ALLOWED)
  @ArrayMaxSize(MAX_MULTI_CITY_ALLOWED)
  multi_city: MultiCitySearchRequestDto[];
}

class FlightSearchResponse {}

export class FlightSearchResponseDto extends BaseAPIResponseDTO<FlightSearchResponse> {}
