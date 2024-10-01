import {
  CustomAPIErrorResponse,
  Roles,
  StandardAPIErrorResponse,
  StandardApiHeaders,
} from 'src/common/decorators';
import { InsuranceService } from './services/Insurance.service';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ERoles } from 'src/shared/enums';
import { AgentRolesGuard } from 'src/common/guards/agent.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BasicInsuranceRateResponseDto } from './dtos';

@Controller('v1/insurance')
@ApiTags('Insurance Component')
export class InsuranceController {
  constructor(private readonly insuranceService: InsuranceService) {}

  @Get('basic-rate')
  @Roles(ERoles.BASIC_INSURANCE_RATE)
  @UseGuards(AgentRolesGuard)
  @ApiOperation({ summary: 'Get Basic Insurance Rate' })
  @StandardApiHeaders('X-ACCESS-TOKEN', 'X-LANG', 'X-VERSION')
  // @ApiBody({
  //   type: BasicInsuranceRateDto,
  //   required: true,
  // })
  @ApiResponse({
    status: 200,
    type: BasicInsuranceRateResponseDto,
  })
  @StandardAPIErrorResponse()
  @StandardApiHeaders('X-ACCESS-TOKEN', 'X-VERSION', 'X-LANG')
  @StandardAPIErrorResponse()
  @CustomAPIErrorResponse([
    'FORBIDDEN_TO_ACCESS',
    'INVALID_TOKEN',
    'TOKEN_EXPIRED',
  ])
  getBasicInsuranceRate() {
    return this.insuranceService.getBasicInsuranceRate();
  }
}
