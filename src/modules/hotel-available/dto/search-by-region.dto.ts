import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { BaseAPIResponseDTO, BaseSeachRequestDto } from 'src/shared/dtos';

export class SearchByRegionDto extends BaseSeachRequestDto {
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Region Id',
    example: '1941',
  })
  // eslint-disable-next-line camelcase
  region_id: string;
}

class SeachByRegionResponse {}

export class SeachByRegionResponseDto extends BaseAPIResponseDTO<SeachByRegionResponse> {}