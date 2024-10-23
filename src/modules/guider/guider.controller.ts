import {
  CustomAPIErrorResponse,
  Roles,
  StandardAPIErrorResponse,
  StandardApiHeaders,
} from 'src/common/decorators';
import { GuilderService } from './services/guider.service';
import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import { ERoles } from 'src/shared/enums';
import { AgentRolesGuard } from 'src/common/guards/agent.guard';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SearchGuilderDto, SearchGuilderResponseDto } from './dtos';

@Controller('v1/guilder/search')
@ApiTags('Guilder Component')
export class GuilderController {
  constructor(private readonly GuilderService: GuilderService) {}

  @Get('')
  @Roles(ERoles.HOTEL_SEARCH_BY_REGION)
  @UseGuards(AgentRolesGuard)
  @ApiOperation({ summary: 'Get Basic Guilder Rate' })
  @StandardApiHeaders('X-ACCESS-TOKEN', 'X-LANG', 'X-VERSION')
  @ApiBody({
    type: SearchGuilderDto,
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: SearchGuilderResponseDto,
  })
  @StandardAPIErrorResponse()
  @StandardApiHeaders('X-ACCESS-TOKEN', 'X-VERSION', 'X-LANG')
  @StandardAPIErrorResponse()
  @CustomAPIErrorResponse([
    'FORBIDDEN_TO_ACCESS',
    'INVALID_TOKEN',
    'TOKEN_EXPIRED',
  ])
  getSearchGuilder(@Body() body: SearchGuilderDto) {
    return this.GuilderService.getSearchGuilder(body);
  }
}
