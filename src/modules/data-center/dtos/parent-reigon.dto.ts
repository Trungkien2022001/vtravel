import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { BaseAPIResponseDTO } from 'src/shared/dtos';

export class ParentRegionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Region Id',
    example: '1941',
  })
  // eslint-disable-next-line camelcase
  region_id: string;
}

class ParentRegionResponse {}

export class ParentRegionResponseDto extends BaseAPIResponseDTO<ParentRegionResponse> {}
