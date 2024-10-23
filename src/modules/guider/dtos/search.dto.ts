import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import {
  BaseAPIResponseDTO,
  BaseGuilderSearchRequestDto,
} from 'src/shared/dtos';

export class SearchGuilderDto extends BaseGuilderSearchRequestDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({
    type: String,
    description: 'Region Id',
    example: '1941',
  })
  // eslint-disable-next-line camelcase
  region_id: string;
}

class SearchGuilderResponse {}

export class SearchGuilderResponseDto extends BaseAPIResponseDTO<SearchGuilderResponse> {}
