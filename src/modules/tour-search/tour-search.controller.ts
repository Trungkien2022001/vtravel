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
import { TourSearchByRegionDto, TourSearchByRegionResponseDto } from './dto';
import { TourSearchbyRegionService } from './services';

@Controller('v1/tour/search')
@ApiTags('Tour Search Component')
export class TourSearchController {
  constructor(
    private readonly tourSearchByRegionService: TourSearchbyRegionService,
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
    return this.tourSearchByRegionService.searchByRegion(body);
  }
}
