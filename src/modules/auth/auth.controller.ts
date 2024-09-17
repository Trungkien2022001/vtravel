import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  HttpStatus,
  HttpCode,
  // UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, LoginResponseDto } from './dto/login.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DatabaseLoggingInterceptor } from 'src/common/interceptors';
import {
  CustomAPIErrorResponse,
  AppStandardApiHeaders,
  StandardAPIErrorResponse,
} from 'src/common/decorators';

@Controller('v1/auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
    return this.authService.login(loginDto);
  }
}
