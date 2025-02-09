import {
  IsString,
  IsBoolean,
  IsNumber,
  ValidateNested,
  IsArray,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class FlightSegmentDto {
  @IsString()
  @ApiProperty({ example: 'MEL' })
  arrival_airport_code: string;

  @IsString()
  @ApiProperty({ example: '2024-12-18T20:20' })
  arrival_date_time: string;

  @IsString()
  @ApiProperty({ example: 'ADL' })
  departure_airport_code: string;

  @IsString()
  @ApiProperty({ example: '2024-12-18T18:30' })
  departure_date_time: string;

  @IsString()
  @ApiProperty({ example: 'JQ779' })
  flight_no: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: '', required: false })
  operating_carrier?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: '', required: false })
  duration?: string;

  @IsString()
  @ApiProperty({ example: 'H' })
  booking_class: string;

  @IsString()
  @ApiProperty({ example: 'Economy' })
  cabin_class: string;

  @IsString()
  @ApiProperty({ example: 'HLOW' })
  fare_basis_code: string;

  @IsString()
  @ApiProperty({ example: 'Y' })
  break_point: string;

  @IsString()
  @ApiProperty({ example: '1' })
  seg_ref: string;

  @IsNumber()
  @ApiProperty({ example: 1 })
  break_index: number;

  @IsString()
  @ApiProperty({ example: 'JQ' })
  airline_code: string;
}

class FareBreakdownDto {
  @IsNumber()
  @ApiProperty({ example: 1518 })
  base_fare: number;

  @IsString()
  @ApiProperty({ example: 'IIT1' })
  pax_id: string;

  @IsString()
  @ApiProperty({ example: 'ADT' })
  pax_type: string;

  @IsNumber()
  @ApiProperty({ example: 1608.78 })
  total_fare: number;

  @IsString()
  @ApiProperty({ example: 'EUR' })
  currency: string;
}

class FareDto {
  @IsString()
  @ApiProperty({ example: 'Economy' })
  cabin_class: string;

  @IsString()
  @ApiProperty({ example: 'H|K' })
  booking_class: string;

  @IsNumber()
  @ApiProperty({ example: 1518 })
  base_fare: number;

  @IsNumber()
  @ApiProperty({ example: 1608.78 })
  total_fare: number;

  @IsString()
  @ApiProperty({ example: 'EUR' })
  currency: string;

  @IsString()
  @ApiProperty({ example: 'ADT' })
  passenger_type: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FareBreakdownDto)
  @ApiProperty({ type: [FareBreakdownDto] })
  fare_breakdowns: FareBreakdownDto[];
}

class FlightDataDto {
  @IsString()
  @ApiProperty({
    example: 'JQ779-EK407-EK855$2024-12-18T18:30$2024-12-19T08:35',
  })
  flight_id: string;

  @IsBoolean()
  @ApiProperty({ example: true })
  nonRefundable: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FlightSegmentDto)
  @ApiProperty({ type: [FlightSegmentDto] })
  outbound: FlightSegmentDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FlightSegmentDto)
  @ApiProperty({ type: [FlightSegmentDto] })
  inbound: FlightSegmentDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FareDto)
  @ApiProperty({ type: [FareDto] })
  fares: FareDto[];
}

export class BaseFlightSearchResponseDto extends FlightDataDto {}
