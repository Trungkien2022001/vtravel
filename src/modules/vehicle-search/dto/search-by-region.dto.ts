import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import {
  BaseAPIResponseDTO,
  BaseVehicleSearchRequestDto,
} from 'src/shared/dtos';

export class VehicleSearchByRegionDto extends BaseVehicleSearchRequestDto {
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Region Id',
    example: '1941',
  })
  // eslint-disable-next-line camelcase
  region_id: string;
}

class VehicleSearchByRegionResponse {}

export class VehicleSearchByRegionResponseDto extends BaseAPIResponseDTO<VehicleSearchByRegionResponse> {}
