import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import {
  BaseAPIResponseDTO,
  BaseVehicleSearchRequestDto,
} from 'src/shared/dtos';

export class VehicleSearchByAirportCodeDto extends BaseVehicleSearchRequestDto {
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Airport Code',
    example: 'HAN',
  })
  // eslint-disable-next-line camelcase
  airport_code: string;
}

class VehicleSearchByAirportCodeResponse {}

export class VehicleSearchByAirportCodeResponseDto extends BaseAPIResponseDTO<VehicleSearchByAirportCodeResponse> {}
