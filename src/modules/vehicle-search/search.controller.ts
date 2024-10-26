import {
  CustomAPIErrorResponse,
  Roles,
  StandardAPIErrorResponse,
  StandardApiHeaders,
  User,
} from 'src/common/decorators';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ERoles } from 'src/shared/enums';
import { AgentRolesGuard } from 'src/common/guards/agent.guard';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  VehicleSearchByAirportCodeDto,
  VehicleSearchByAirportCodeResponseDto,
  VehicleSearchByIdDto,
  VehicleSearchByIdResponseDto,
  VehicleSearchByRegionDto,
  VehicleSearchByRegionResponseDto,
} from './dto';
import { VehicleSearchbyRegionService } from './services';
import { VehicleSearchbyAirportCodeService } from './services/search-by-airport-code.service';
import { VehicleSearchbyIdService } from './services/search-by-id.service';

@Controller('v1/vehicle/search')
@ApiTags('Vehicle Search Component')
export class VehicleSearchController {
  constructor(
    private readonly VehicleSearchByRegionService: VehicleSearchbyRegionService,
    private readonly VehicleSearchByAirportCodeService: VehicleSearchbyAirportCodeService,
    private readonly VehicleSearchByIdService: VehicleSearchbyIdService,
  ) {}

  @Post('region')
  @Roles(ERoles.VEHICLE_SEARCH_BY_REGION)
  @UseGuards(AgentRolesGuard)
  @ApiOperation({ summary: 'Vehicle Search by Region Id' })
  @StandardApiHeaders('X-ACCESS-TOKEN', 'X-LANG', 'X-VERSION')
  @ApiBody({
    type: VehicleSearchByRegionDto,
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: VehicleSearchByRegionResponseDto,
  })
  @StandardAPIErrorResponse()
  @StandardApiHeaders('X-ACCESS-TOKEN', 'X-VERSION', 'X-LANG')
  @StandardAPIErrorResponse()
  @CustomAPIErrorResponse([
    'FORBIDDEN_TO_ACCESS',
    'INVALID_TOKEN',
    'TOKEN_EXPIRED',
  ])
  searchByRegion(
    @Body() body: VehicleSearchByRegionDto,
    @User('id') agentId: number,
  ) {
    return this.VehicleSearchByRegionService.search(body, agentId);
  }

  @Post('airport-code')
  @Roles(ERoles.VEHICLE_SEARCH_BY_AIRPORT_CODE)
  @UseGuards(AgentRolesGuard)
  @ApiOperation({ summary: 'Tour Search by Airport Code' })
  @StandardApiHeaders('X-ACCESS-TOKEN', 'X-LANG', 'X-VERSION')
  @ApiBody({
    type: VehicleSearchByAirportCodeDto,
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: VehicleSearchByAirportCodeResponseDto,
  })
  @StandardAPIErrorResponse()
  @StandardApiHeaders('X-ACCESS-TOKEN', 'X-VERSION', 'X-LANG')
  @StandardAPIErrorResponse()
  @CustomAPIErrorResponse([
    'FORBIDDEN_TO_ACCESS',
    'INVALID_TOKEN',
    'TOKEN_EXPIRED',
  ])
  searchByAirportCode(@Body() body: VehicleSearchByAirportCodeDto) {
    return this.VehicleSearchByAirportCodeService.search(body);
  }

  @Post('id')
  @Roles(ERoles.VEHICLE_SEARCH_BY_IDS)
  @UseGuards(AgentRolesGuard)
  @ApiOperation({ summary: 'Tour Search by  Ids' })
  @StandardApiHeaders('X-ACCESS-TOKEN', 'X-LANG', 'X-VERSION')
  @ApiBody({
    type: VehicleSearchByIdDto,
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: VehicleSearchByIdResponseDto,
  })
  @StandardAPIErrorResponse()
  @StandardApiHeaders('X-ACCESS-TOKEN', 'X-VERSION', 'X-LANG')
  @StandardAPIErrorResponse()
  @CustomAPIErrorResponse([
    'FORBIDDEN_TO_ACCESS',
    'INVALID_TOKEN',
    'TOKEN_EXPIRED',
  ])
  searchById(@Body() body: VehicleSearchByIdDto) {
    return this.VehicleSearchByIdService.search(body);
  }
}
