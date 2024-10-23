import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { BaseAPIResponseDTO } from 'src/shared/dtos';

export class HotelPlaceholderSuggestedDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @ApiProperty({
    type: String,
    description: 'Region Id',
    example: '1941',
  })
  // eslint-disable-next-line camelcase
  text: string;
}

class HotelPlaceholderSuggestedResponse {}

export class HotelPlaceholderSuggestedResponseDto extends BaseAPIResponseDTO<HotelPlaceholderSuggestedResponse> {}
