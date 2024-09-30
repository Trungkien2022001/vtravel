import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { BaseAPIResponseDTO, BaseHotelSeachRequestDto } from 'src/shared/dtos';

export class SearchByRegionDto extends BaseHotelSeachRequestDto {
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Region Id',
    example: '1941',
  })
  // eslint-disable-next-line camelcase
  region_id: string;
}

class SearchByRegionResponse {}

export class SearchByRegionResponseDto extends BaseAPIResponseDTO<SearchByRegionResponse> {}
