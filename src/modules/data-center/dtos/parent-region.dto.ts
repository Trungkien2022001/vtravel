import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { BaseAPIResponseDTO } from 'src/shared/dtos';

export class ParentRegionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Property Id',
    example: '1941',
  })
  property_id: string;

  @IsString()
  // @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Region Type',
    example: 'Region',
  })
  property_type: string;
}

class ParentRegionResponse {}

export class ParentRegionResponseDto extends BaseAPIResponseDTO<ParentRegionResponse> {}
