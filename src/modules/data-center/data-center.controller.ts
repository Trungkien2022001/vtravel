import {
  CustomAPIErrorResponse,
  Roles,
  StandardAPIErrorResponse,
  StandardApiHeaders,
} from 'src/common/decorators';
import { DataCenterService } from './services/data-center.service';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  SeachByRegionResponseDto,
  SearchByRegionDto,
} from '../hotel-available/dto';
import { ERoles } from 'src/shared/enums';
import { AgentRolesGuard } from 'src/common/guards/agent.guard';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('v1/hotel-info-search')
export class DataCenterController {
  constructor(private readonly DataCenterService: DataCenterService) {}

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
    return this.DataCenterService.searchByRegion(body);
  }
}
