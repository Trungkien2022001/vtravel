import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsString } from 'class-validator';
import { MAX_HOTEL_IDS_SEARCH } from 'src/shared/constants';
import { BaseAPIResponseDTO, BaseSeachRequestDto } from 'src/shared/dtos';

export class SearchByHotelIdsDto extends BaseSeachRequestDto {
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(MAX_HOTEL_IDS_SEARCH)
  @ApiProperty({
    type: [String],
    description: 'List of hotel ids',
    example: [1, 2, 3],
  })
  // eslint-disable-next-line camelcase
  hotel_ids: string[];
}

class SeachByHotelIdsResponse {}

export class SeachByHotelIdsResponseDto extends BaseAPIResponseDTO<SeachByHotelIdsResponse> {}
