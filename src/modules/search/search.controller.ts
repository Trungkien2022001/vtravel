import { SeachByAirportCodeResponseSto, SearchByAirportCodeDto } from './dto';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SearchService } from './seach.service';
import { DatabaseLoggingInterceptor } from 'src/common';
import {
  CustomAPIErrorResponse,
  Roles,
  StandardAPIErrorResponse,
  StandardApiHeaders,
} from 'src/common/decorators';
import { ERoles } from 'src/shared/enums';
import { AgentRolesGuard } from 'src/common/guards/agent.guard';

@Controller('v1/search')
@ApiTags('Search Component')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post('/airport-code')
  @Roles(ERoles.SEARCH_BY_AIRPORT_CODE)
  @UseGuards(AgentRolesGuard)
  @ApiOperation({ summary: 'Search by Airport Code' })
  @StandardApiHeaders('X-ACCESS-TOKEN', 'X-LANG', 'X-VERSION')
  @ApiBody({
    type: SearchByAirportCodeDto,
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: SeachByAirportCodeResponseSto,
  })
  @StandardAPIErrorResponse()
  @CustomAPIErrorResponse(['TOKEN_EXPIRED'])
  @UseInterceptors(DatabaseLoggingInterceptor)
  async SearchByAirportCode(@Body() body: SearchByAirportCodeDto) {
    return this.searchService.searchByAirportCode(body);
  }
}
