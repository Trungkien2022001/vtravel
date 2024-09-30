import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { BaseAPIResponseDTO, BaseHotelSeachRequestDto } from 'src/shared/dtos';

export class HotelDetailDto extends BaseHotelSeachRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Hotel ID',
    example: '1234',
  })
  // eslint-disable-next-line camelcase
  hotel_id: string;
}

class HotelDetailResponse {}

export class HotelDetailResponseDto extends BaseAPIResponseDTO<HotelDetailResponse> {}
