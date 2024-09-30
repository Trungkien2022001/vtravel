import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HotelBookService } from './service';
import { DatabaseLoggingInterceptor } from 'src/common';
import {
  CustomAPIErrorResponse,
  Roles,
  StandardAPIErrorResponse,
  StandardApiHeaders,
} from 'src/common/decorators';
import { ERoles } from 'src/shared/enums';
import { AgentRolesGuard } from 'src/common/guards/agent.guard';

@Controller('v1/hotel/book')
@ApiTags('Hotel Book Component')
export class HotelBookController {
  constructor(private readonly HotelBookService: HotelBookService) {}

  @Post('/airport-code')
  @Roles(ERoles.HOTEL_SEARCH_BY_AIRPORT_CODE)
  @UseGuards(AgentRolesGuard)
  @ApiOperation({ summary: '' })
  @StandardApiHeaders('X-ACCESS-TOKEN', 'X-LANG', 'X-VERSION')
  @ApiBody({
    type: Object,
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: Object,
  })
  @StandardAPIErrorResponse()
  @CustomAPIErrorResponse(['TOKEN_EXPIRED'])
  @UseInterceptors(DatabaseLoggingInterceptor)
  async SearchByAirportCode(@Body() body: any) {
    return this.HotelBookService.get();
  }
}
