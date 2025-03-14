import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HotelDetailService } from './service';
import { DatabaseLoggingInterceptor } from 'src/common';
import {
  CustomAPIErrorResponse,
  Roles,
  StandardAPIErrorResponse,
  StandardApiHeaders,
} from 'src/common/decorators';
import { ERoles } from 'src/shared/enums';
import { AgentRolesGuard } from 'src/common/guards/agent.guard';
import { HotelDetailDto, HotelDetailResponseDto } from './dto';

@Controller('v1/hotel/detail')
@ApiTags('Hotel Detail Component')
export class HotelDetailController {
  constructor(private readonly hotelDetailService: HotelDetailService) {}

  @Post('')
  @Roles(ERoles.HOTEL_SEARCH_BY_AIRPORT_CODE)
  @UseGuards(AgentRolesGuard)
  @ApiOperation({ summary: 'Get Hotel Detail' })
  @StandardApiHeaders('X-ACCESS-TOKEN', 'X-LANG', 'X-VERSION')
  @ApiBody({
    type: HotelDetailDto,
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: HotelDetailResponseDto,
  })
  @StandardAPIErrorResponse()
  @CustomAPIErrorResponse(['TOKEN_EXPIRED'])
  //@UseInterceptors(DatabaseLoggingInterceptor)
  async SearchByAirportCode(@Body() body: HotelDetailDto) {
    return this.hotelDetailService.getHotelDetail(body);
  }
}
