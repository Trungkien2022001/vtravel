import {
  CustomAPIErrorResponse,
  Roles,
  StandardAPIErrorResponse,
  StandardApiHeaders,
} from 'src/common/decorators';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ERoles } from 'src/shared/enums';
import { AgentRolesGuard } from 'src/common/guards/agent.guard';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  TourSearchByAirportCodeDto,
  TourSearchByAirportCodeResponseDto,
  TourSearchByIdDto,
  TourSearchByIdResponseDto,
  TourSearchByRegionDto,
  TourSearchByRegionResponseDto,
} from './dto';
import { TourSearchbyRegionService } from './services';
import { TourSearchbyAirportCodeService } from './services/search-by-airport-code.service';
import { TourSearchbyIdService } from './services/search-by-id.service';

@Controller('v1/tour/search')
@ApiTags('Tour Search Component')
export class TourSearchController {
  constructor(
    private readonly tourSearchByRegionService: TourSearchbyRegionService,
    private readonly tourSearchByAirportCodeService: TourSearchbyAirportCodeService,
    private readonly tourSearchByIdService: TourSearchbyIdService,
  ) {}

  @Post('region')
  @Roles(ERoles.TOUR_SEARCH_BY_REGION)
  @UseGuards(AgentRolesGuard)
  @ApiOperation({ summary: 'Tour Search by Region Id' })
  @StandardApiHeaders('X-ACCESS-TOKEN', 'X-LANG', 'X-VERSION')
  @ApiBody({
    type: TourSearchByRegionDto,
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: TourSearchByRegionResponseDto,
  })
  @StandardAPIErrorResponse()
  @StandardApiHeaders('X-ACCESS-TOKEN', 'X-VERSION', 'X-LANG')
  @StandardAPIErrorResponse()
  @CustomAPIErrorResponse([
    'FORBIDDEN_TO_ACCESS',
    'INVALID_TOKEN',
    'TOKEN_EXPIRED',
  ])
  searchByRegion(@Body() body: TourSearchByRegionDto) {
    return this.tourSearchByRegionService.search(body);
  }

  @Post('airport-code')
  @Roles(ERoles.TOUR_SEARCH_BY_AIRPORT_CODE)
  @UseGuards(AgentRolesGuard)
  @ApiOperation({ summary: 'Tour Search by Airport Code' })
  @StandardApiHeaders('X-ACCESS-TOKEN', 'X-LANG', 'X-VERSION')
  @ApiBody({
    type: TourSearchByAirportCodeDto,
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: TourSearchByAirportCodeResponseDto,
  })
  @StandardAPIErrorResponse()
  @StandardApiHeaders('X-ACCESS-TOKEN', 'X-VERSION', 'X-LANG')
  @StandardAPIErrorResponse()
  @CustomAPIErrorResponse([
    'FORBIDDEN_TO_ACCESS',
    'INVALID_TOKEN',
    'TOKEN_EXPIRED',
  ])
  searchByAirportCode(@Body() body: TourSearchByAirportCodeDto) {
    return this.tourSearchByAirportCodeService.search(body);
  }

  @Post('id')
  @Roles(ERoles.TOUR_SEARCH_BY_IDS)
  @UseGuards(AgentRolesGuard)
  @ApiOperation({ summary: 'Tour Search by  Ids' })
  @StandardApiHeaders('X-ACCESS-TOKEN', 'X-LANG', 'X-VERSION')
  @ApiBody({
    type: TourSearchByIdDto,
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: TourSearchByIdResponseDto,
  })
  @StandardAPIErrorResponse()
  @StandardApiHeaders('X-ACCESS-TOKEN', 'X-VERSION', 'X-LANG')
  @StandardAPIErrorResponse()
  @CustomAPIErrorResponse([
    'FORBIDDEN_TO_ACCESS',
    'INVALID_TOKEN',
    'TOKEN_EXPIRED',
  ])
  searchById(@Body() body: TourSearchByIdDto) {
    return this.tourSearchByIdService.search(body);
  }
}
