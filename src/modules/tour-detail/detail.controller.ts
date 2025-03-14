import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TourDetailService } from './service';
import { DatabaseLoggingInterceptor } from 'src/common';
import {
  CustomAPIErrorResponse,
  Roles,
  StandardAPIErrorResponse,
  StandardApiHeaders,
} from 'src/common/decorators';
import { ERoles } from 'src/shared/enums';
import { AgentRolesGuard } from 'src/common/guards/agent.guard';
import { TourDetailDto, TourDetailResponseDto } from './dto';

@Controller('v1/tour/detail')
@ApiTags('Tour Detail Component')
export class TourDetailController {
  constructor(private readonly tourDetailService: TourDetailService) {}

  @Post('')
  @Roles(ERoles.TOUR_DETAIL)
  @UseGuards(AgentRolesGuard)
  @ApiOperation({ summary: 'Get Tour Detail' })
  @StandardApiHeaders('X-ACCESS-TOKEN', 'X-LANG', 'X-VERSION')
  @ApiBody({
    type: TourDetailDto,
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: TourDetailResponseDto,
  })
  @StandardAPIErrorResponse()
  @CustomAPIErrorResponse(['TOKEN_EXPIRED'])
  //@UseInterceptors(DatabaseLoggingInterceptor)
  async SearchByAirportCode(@Body() body: TourDetailDto) {
    return this.tourDetailService.getTourDetail(body);
  }
}
