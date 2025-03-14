import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  // UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DatabaseLoggingInterceptor } from 'src/common/interceptors';
import {
  CustomAPIErrorResponse,
  StandardApiHeaders,
  StandardAPIErrorResponse,
} from 'src/common/decorators';
import { LoginDto, LoginResponseDto } from './dto';

@Controller('v1/auth')
@ApiTags('Auth Agent Component')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  //@UseInterceptors(DatabaseLoggingInterceptor)
  @ApiOperation({ summary: 'Agent Login' })
  @StandardApiHeaders('X-KEY', 'X-VERSION', 'X-ACCESS-TOKEN', 'X-LANG')
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
  loginAgent(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
