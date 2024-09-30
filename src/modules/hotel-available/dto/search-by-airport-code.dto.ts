import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { AIRPORT_CODE_LENGTH } from 'src/shared/constants';
import { BaseAPIResponseDTO, BaseHotelSeachRequestDto } from 'src/shared/dtos';

export class SearchByAirportCodeDto extends BaseHotelSeachRequestDto {
  @IsString()
  @Length(AIRPORT_CODE_LENGTH)
  @ApiProperty({
    type: String,
    description: 'Airport Code',
    example: 'HAN',
  })
  // eslint-disable-next-line camelcase
  airport_code: string;
}

class SeachByAirportCodeResponse {}

export class SeachByAirportCodeResponseDto extends BaseAPIResponseDTO<SeachByAirportCodeResponse> {}
