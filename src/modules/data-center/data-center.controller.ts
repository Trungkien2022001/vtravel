import {
  CustomAPIErrorResponse,
  Roles,
  StandardAPIErrorResponse,
  StandardApiHeaders,
} from 'src/common/decorators';
import { DataCenterService } from './services/data-center.service';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ERoles } from 'src/shared/enums';
import { AgentRolesGuard } from 'src/common/guards/agent.guard';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  HotelPlaceholderSuggestedDto,
  HotelPlaceholderSuggestedResponseDto,
} from './dtos';

@Controller('v1/data-center')
@ApiTags('Data Center Component')
export class DataCenterController {
  constructor(private readonly dataCenterService: DataCenterService) {}

  @Post('hotel-placeholder-suggested')
  @Roles(ERoles.HOTEL_SEARCH_BY_AIRPORT_CODE)
  @UseGuards(AgentRolesGuard)
  @ApiOperation({ summary: 'Get Hotel Suggest Place Holder' })
  @StandardApiHeaders('X-ACCESS-TOKEN', 'X-LANG', 'X-VERSION')
  @ApiBody({
    type: HotelPlaceholderSuggestedDto,
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: HotelPlaceholderSuggestedResponseDto,
  })
  @StandardAPIErrorResponse()
  @StandardApiHeaders('X-ACCESS-TOKEN', 'X-VERSION', 'X-LANG')
  @StandardAPIErrorResponse()
  @CustomAPIErrorResponse([
    'FORBIDDEN_TO_ACCESS',
    'INVALID_TOKEN',
    'TOKEN_EXPIRED',
  ])
  searchByRegion(@Body() body: HotelPlaceholderSuggestedDto) {
    return this.dataCenterService.getHotelPlaceHolderSuggested(body.text);
  }
}
