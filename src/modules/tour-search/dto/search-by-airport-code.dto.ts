import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { BaseAPIResponseDTO, BaseTourSearchRequestDto } from 'src/shared/dtos';

export class TourSearchByAirportCodeDto extends BaseTourSearchRequestDto {
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Airport Code',
    example: 'HAN',
  })
  // eslint-disable-next-line camelcase
  airport_code: string;
}

class TourSearchByAirportCodeResponse {}

export class TourSearchByAirportCodeResponseDto extends BaseAPIResponseDTO<TourSearchByAirportCodeResponse> {}
