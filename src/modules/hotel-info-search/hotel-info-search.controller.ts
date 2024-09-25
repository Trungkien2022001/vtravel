import {
  CustomAPIErrorResponse,
  Roles,
  StandardAPIErrorResponse,
  StandardApiHeaders,
} from 'src/common/decorators';
import { HotelInfoSearchService } from './services/hotel-info-search.service';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SeachByRegionResponseDto, SearchByRegionDto } from '../search/dto';
import { ERoles } from 'src/shared/enums';
import { AgentRolesGuard } from 'src/common/guards/agent.guard';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('v1/hotel-info-search')
export class HotelInfoSearchController {
  constructor(
    private readonly hotelInfoSearchService: HotelInfoSearchService,
  ) {}

  @Post('region')
  @Roles(ERoles.SEARCH_BY_AIRPORT_CODE)
  @UseGuards(AgentRolesGuard)
  @ApiOperation({ summary: 'Search by Region Id' })
  @StandardApiHeaders('X-ACCESS-TOKEN', 'X-LANG', 'X-VERSION')
  @ApiBody({
    type: SearchByRegionDto,
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: SeachByRegionResponseDto,
  })
  @StandardAPIErrorResponse()
  @StandardApiHeaders('X-ACCESS-TOKEN', 'X-VERSION', 'X-LANG')
  @StandardAPIErrorResponse()
  @CustomAPIErrorResponse([
    'FORBIDDEN_TO_ACCESS',
    'INVALID_TOKEN',
    'TOKEN_EXPIRED',
  ])
  searchByRegion(@Body() body: SearchByRegionDto) {
    return this.hotelInfoSearchService.searchByRegion(body);
  }
}
