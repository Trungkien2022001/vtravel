import {
  CustomAPIErrorResponse,
  Roles,
  StandardAPIErrorResponse,
  StandardApiHeaders,
} from 'src/common/decorators';
import { HotelSearchService } from './services/hotel-search.service';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  SearchByRegionResponseDto,
  SearchByRegionDto,
  SearchByAirportCodeDto,
  SeachByAirportCodeResponseDto,
} from '../hotel-available/dto';
import { ERoles } from 'src/shared/enums';
import { AgentRolesGuard } from 'src/common/guards/agent.guard';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AgentIpWhitelistGuard } from 'src/common/guards';

@Controller('v1/hotel/search')
@ApiTags('Hotel Search Component')
export class HotelSearchController {
  constructor(private readonly HotelSearchService: HotelSearchService) {}

  @Post('region')
  @Roles(ERoles.HOTEL_SEARCH_BY_REGION)
  @UseGuards(AgentRolesGuard, AgentIpWhitelistGuard)
  @ApiOperation({ summary: 'Search by Region Id' })
  @StandardApiHeaders('X-ACCESS-TOKEN', 'X-LANG', 'X-VERSION')
  @ApiBody({
    type: SearchByRegionDto,
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: SearchByRegionResponseDto,
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
    return this.HotelSearchService.searchByRegion(body);
  }

  @Post('airport-code')
  @Roles(ERoles.HOTEL_SEARCH_BY_AIRPORT_CODE)
  @UseGuards(AgentRolesGuard)
  @ApiOperation({ summary: 'Search by Region Id' })
  @StandardApiHeaders('X-ACCESS-TOKEN', 'X-LANG', 'X-VERSION')
  @ApiBody({
    type: SearchByAirportCodeDto,
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: SeachByAirportCodeResponseDto,
  })
  @StandardAPIErrorResponse()
  @StandardApiHeaders('X-ACCESS-TOKEN', 'X-VERSION', 'X-LANG')
  @StandardAPIErrorResponse()
  @CustomAPIErrorResponse([
    'FORBIDDEN_TO_ACCESS',
    'INVALID_TOKEN',
    'TOKEN_EXPIRED',
  ])
  searchByAirportCode(@Body() body: SearchByAirportCodeDto) {
    return this.HotelSearchService.searchByAirportCode(body);
  }
}
