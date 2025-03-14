import { TransferSearchResponseDto, TransferSearchDto } from './dto';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AvailableService } from './service';
import { DatabaseLoggingInterceptor } from 'src/common';
import {
  CustomAPIErrorResponse,
  Roles,
  StandardAPIErrorResponse,
  StandardApiHeaders,
  User,
} from 'src/common/decorators';
import { ERoles } from 'src/shared/enums';
import { AgentRolesGuard } from 'src/common/guards/agent.guard';

@Controller('v1/transfer/available')
@ApiTags('Transfer Search Component')
export class AvailableController {
  constructor(private readonly availableService: AvailableService) {}

  @Post('/region')
  @Roles(ERoles.HOTEL_SEARCH_BY_AIRPORT_CODE)
  @UseGuards(AgentRolesGuard)
  @ApiOperation({ summary: 'Transfer Search' })
  @StandardApiHeaders('X-ACCESS-TOKEN', 'X-LANG', 'X-VERSION')
  @ApiBody({
    type: TransferSearchDto,
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: TransferSearchResponseDto,
  })
  @StandardAPIErrorResponse()
  @CustomAPIErrorResponse(['TOKEN_EXPIRED'])
  //@UseInterceptors(DatabaseLoggingInterceptor)
  async TransferSesrch(
    // @Body() body: TransferSearchDto,
    @Body() body: any,
    @User('id') agentId: number,
  ) {
    return this.availableService.search(body, agentId);
  }
}
