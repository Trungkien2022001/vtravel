import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  // UseGuards,
} from '@nestjs/common';
import { AuthAdminService } from './auth-admin.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DatabaseLoggingInterceptor } from 'src/common/interceptors';
import {
  CustomAPIErrorResponse,
  AppStandardApiHeaders,
  StandardAPIErrorResponse,
} from 'src/common/decorators';
import { LoginDto, LoginResponseDto } from './dto';

@Controller('v1/admin/auth')
@ApiTags('Auth')
export class AuthAdminController {
  constructor(private readonly authAdminService: AuthAdminService) {}

  @Post('/login')
  @UseInterceptors(DatabaseLoggingInterceptor)
  @ApiOperation({ summary: 'Agent Login' })
  @AppStandardApiHeaders('X-KEY', 'X-VERSION', 'X-ACCESS-TOKEN', 'X-LANG')
  @ApiBody({
    type: LoginDto,
    required: true,
    description: 'Login Body',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successfully.',
    type: LoginResponseDto,
  })
  @CustomAPIErrorResponse(['VALIDATION_ERROR', 'UNAUTHORIZED'])
  @StandardAPIErrorResponse()
  create(@Body() loginDto: LoginDto) {
    return this.authAdminService.login(loginDto);
  }
}
