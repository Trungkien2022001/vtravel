import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VehicleDetailService } from './service';
import { DatabaseLoggingInterceptor } from 'src/common';
import {
  CustomAPIErrorResponse,
  Roles,
  StandardAPIErrorResponse,
  StandardApiHeaders,
} from 'src/common/decorators';
import { ERoles } from 'src/shared/enums';
import { AgentRolesGuard } from 'src/common/guards/agent.guard';
import { VehicleDetailDto, VehicleDetailResponseDto } from './dto';

@Controller('v1/tour/detail')
@ApiTags('Tour Detail Component')
export class VehicleDetailController {
  constructor(private readonly VehicleDetailService: VehicleDetailService) {}

  @Post('')
  @Roles(ERoles.TOUR_DETAIL)
  @UseGuards(AgentRolesGuard)
  @ApiOperation({ summary: 'Get Tour Detail' })
  @StandardApiHeaders('X-ACCESS-TOKEN', 'X-LANG', 'X-VERSION')
  @ApiBody({
    type: VehicleDetailDto,
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: VehicleDetailResponseDto,
  })
  @StandardAPIErrorResponse()
  @CustomAPIErrorResponse(['TOKEN_EXPIRED'])
  @UseInterceptors(DatabaseLoggingInterceptor)
  async SearchByAirportCode(@Body() body: VehicleDetailDto) {
    return this.VehicleDetailService.getVehicleDetail(body);
  }
}
