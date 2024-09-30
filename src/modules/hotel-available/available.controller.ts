import {
  SeachByAirportCodeResponseDto,
  SeachByHotelIdsResponseDto,
  SearchByRegionResponseDto,
  SearchByAirportCodeDto,
  SearchByHotelIdsDto,
  SearchByRegionDto,
} from './dto';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  SearchByAirportCodeService,
  SearchByRegionService,
  AvailableService,
  SearchByHotelIdsService,
} from './service';
import { DatabaseLoggingInterceptor } from 'src/common';
import {
  CustomAPIErrorResponse,
  Roles,
  StandardAPIErrorResponse,
  StandardApiHeaders,
} from 'src/common/decorators';
import { ERoles } from 'src/shared/enums';
import { AgentRolesGuard } from 'src/common/guards/agent.guard';

@Controller('v1/hotel/available')
@ApiTags('Hotel Availability Only Component')
export class AvailableController {
  constructor(
    private readonly availableService: AvailableService,
    private readonly searchByAirportCodeService: SearchByAirportCodeService,
    private readonly searchByRegionService: SearchByRegionService,
    private readonly searchByHotelIdsService: SearchByHotelIdsService,
  ) {}

  @Post('/airport-code')
  @Roles(ERoles.HOTEL_SEARCH_BY_AIRPORT_CODE)
  @UseGuards(AgentRolesGuard)
  @ApiOperation({ summary: 'Search by Airport Code' })
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
  @CustomAPIErrorResponse(['TOKEN_EXPIRED'])
  @UseInterceptors(DatabaseLoggingInterceptor)
  async SearchByAirportCode(@Body() body: SearchByAirportCodeDto) {
    return this.searchByAirportCodeService.search(body);
  }

  @Post('/region')
  @Roles(ERoles.HOTEL_SEARCH_BY_REGION)
  @UseGuards(AgentRolesGuard)
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
  @CustomAPIErrorResponse(['TOKEN_EXPIRED'])
  @UseInterceptors(DatabaseLoggingInterceptor)
  async SearchByRegion(@Body() body: SearchByRegionDto) {
    return this.searchByRegionService.search(body);
  }

  @Post('/hotel-ids')
  @Roles(ERoles.HOTEL_SEARCH_BY_HOTEL_IDS)
  @UseGuards(AgentRolesGuard)
  @ApiOperation({ summary: 'Search by Hotel Ids' })
  @StandardApiHeaders('X-ACCESS-TOKEN', 'X-LANG', 'X-VERSION')
  @ApiBody({
    type: SearchByHotelIdsDto,
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: SeachByHotelIdsResponseDto,
  })
  @StandardAPIErrorResponse()
  @CustomAPIErrorResponse(['TOKEN_EXPIRED'])
  @UseInterceptors(DatabaseLoggingInterceptor)
  async SearchByHotelIds(@Body() body: SearchByHotelIdsDto) {
    return this.searchByHotelIdsService.search(body);
  }
}
