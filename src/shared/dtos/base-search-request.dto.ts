import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import {
  MAX_ADULT_ALLOWED,
  MAX_CHILDREN_ALLOWED,
  MAX_INFANT_ALLOWED,
  MAX_ROOM_ALLOWED,
  MAX_TOUR_DURATION,
  MIN_ADULT_ALLOWED,
  MIN_CHILDREN_ALLOWED,
  MIN_INFANT_ALLOWED,
  MIN_ROOM_ALLOWED,
} from '../constants';
import { IsDateOnly } from 'src/common/decorators';
import { Type } from 'class-transformer';

export class RoomsSearchRequestDto {
  @IsNumber()
  @ApiProperty({
    type: Number,
    description: 'Number of adults!',
    example: 2,
    minimum: MIN_ADULT_ALLOWED,
    maximum: MAX_ADULT_ALLOWED,
  })
  @Min(MIN_ADULT_ALLOWED)
  @Max(MAX_ADULT_ALLOWED)
  adult: number;

  @IsNumber()
  @ApiProperty({
    type: Number,
    description: 'Number of childrens!',
    example: 1,
    minimum: MIN_CHILDREN_ALLOWED,
    maximum: MAX_CHILDREN_ALLOWED,
  })
  @Min(MIN_CHILDREN_ALLOWED)
  @Max(MAX_CHILDREN_ALLOWED)
  children: number;

  @IsNumber()
  @ApiProperty({
    type: Number,
    description: 'Number of infants!',
    example: 1,
    minimum: MIN_INFANT_ALLOWED,
    maximum: MAX_INFANT_ALLOWED,
  })
  @Min(MIN_INFANT_ALLOWED)
  @Max(MAX_INFANT_ALLOWED)
  infant: number;
}

export class BaseHotelSeachRequestDto {
  @ValidateNested({ each: true })
  @Type(() => RoomsSearchRequestDto)
  @ApiProperty({
    type: [RoomsSearchRequestDto],
    description: 'Number of rooms!',
  })
  @ArrayMinSize(MIN_ROOM_ALLOWED)
  @ArrayMaxSize(MAX_ROOM_ALLOWED)
  rooms: RoomsSearchRequestDto[];

  @IsString()
  @IsDateOnly()
  @ApiProperty({
    type: String,
    description: 'Checkin Date',
    example: '2026-02-20',
  })
  checkin: string;

  @IsString()
  @IsDateOnly()
  @ApiProperty({
    type: String,
    description: 'Checkout Date',
    example: '2026-02-22',
  })
  checkout: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Currency',
    example: 'VND',
  })
  currency: string;
}

export class BaseTourSearchRequestDto {
  @IsString()
  @IsDateOnly()
  @ApiProperty({
    type: String,
    description: 'Checkin Date',
    example: '2026-02-20',
  })
  checkin: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: Number,
    description: 'Day of Durations',
    example: 2,
  })
  @Min(1)
  @Max(MAX_TOUR_DURATION)
  duration: number;

  @IsNumber()
  @ApiProperty({
    type: Number,
    description: 'Number of adults!',
    example: 2,
    minimum: MIN_ADULT_ALLOWED,
    maximum: MAX_ADULT_ALLOWED,
  })
  @Min(MIN_ADULT_ALLOWED)
  @Max(MAX_ADULT_ALLOWED)
  adult: number;

  @IsNumber()
  @ApiProperty({
    type: Number,
    description: 'Number of childrens!',
    example: 1,
    minimum: MIN_CHILDREN_ALLOWED,
    maximum: MAX_CHILDREN_ALLOWED,
  })
  @Min(MIN_CHILDREN_ALLOWED)
  @Max(MAX_CHILDREN_ALLOWED)
  children: number;

  @IsNumber()
  @ApiProperty({
    type: Number,
    description: 'Number of infants!',
    example: 1,
    minimum: MIN_INFANT_ALLOWED,
    maximum: MAX_INFANT_ALLOWED,
  })
  @Min(MIN_INFANT_ALLOWED)
  @Max(MAX_INFANT_ALLOWED)
  infant: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Currency',
    example: 'VND',
  })
  currency: string;
}
export class BaseVehicleSearchRequestDto {
  @IsString()
  @IsDateOnly()
  @ApiProperty({
    type: String,
    description: 'Checkin Date',
    example: '2026-02-20',
  })
  checkin: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    type: Number,
    description: 'Day of Durations',
    example: 2,
  })
  @Min(1)
  @Max(MAX_TOUR_DURATION)
  duration: number;

  @IsNumber()
  @ApiProperty({
    type: Number,
    description: 'Number of adults!',
    example: 2,
    minimum: MIN_ADULT_ALLOWED,
    maximum: MAX_ADULT_ALLOWED,
  })
  @Min(MIN_ADULT_ALLOWED)
  @Max(MAX_ADULT_ALLOWED)
  adult: number;

  @IsNumber()
  @ApiProperty({
    type: Number,
    description: 'Number of childrens!',
    example: 1,
    minimum: MIN_CHILDREN_ALLOWED,
    maximum: MAX_CHILDREN_ALLOWED,
  })
  @Min(MIN_CHILDREN_ALLOWED)
  @Max(MAX_CHILDREN_ALLOWED)
  children: number;

  @IsNumber()
  @ApiProperty({
    type: Number,
    description: 'Number of infants!',
    example: 1,
    minimum: MIN_INFANT_ALLOWED,
    maximum: MAX_INFANT_ALLOWED,
  })
  @Min(MIN_INFANT_ALLOWED)
  @Max(MAX_INFANT_ALLOWED)
  infant: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Currency',
    example: 'VND',
  })
  currency: string;
}
