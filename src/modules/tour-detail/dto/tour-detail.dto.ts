import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { BaseAPIResponseDTO, BaseTourSearchRequestDto } from 'src/shared/dtos';

export class TourDetailDto extends BaseTourSearchRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Tour ID',
    example: '1234',
  })
  // eslint-disable-next-line camelcase
  tour_id: string;
}

class TourDetailResponse {}

export class TourDetailResponseDto extends BaseAPIResponseDTO<TourDetailResponse> {}
