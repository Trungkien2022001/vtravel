import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsString } from 'class-validator';
import { MAX_TOUR_IDS_SEARCH } from 'src/shared/constants';
import { BaseAPIResponseDTO, BaseTourSearchRequestDto } from 'src/shared/dtos';

export class TourSearchByIdDto extends BaseTourSearchRequestDto {
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(MAX_TOUR_IDS_SEARCH)
  @ApiProperty({
    type: [String],
    description: 'List of tour ids',
    example: ['1', '2', '3'],
  })
  // eslint-disable-next-line camelcase
  hotel_ids: string[];
}

class TourSearchByIdResponse {}

export class TourSearchByIdResponseDto extends BaseAPIResponseDTO<TourSearchByIdResponse> {}
