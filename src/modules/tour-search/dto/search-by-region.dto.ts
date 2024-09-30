import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { BaseAPIResponseDTO, BaseTourSearchRequestDto } from 'src/shared/dtos';

export class TourSearchByRegionDto extends BaseTourSearchRequestDto {
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Region Id',
    example: '1941',
  })
  // eslint-disable-next-line camelcase
  region_id: string;
}

class TourSearchByRegionResponse {}

export class TourSearchByRegionResponseDto extends BaseAPIResponseDTO<TourSearchByRegionResponse> {}
