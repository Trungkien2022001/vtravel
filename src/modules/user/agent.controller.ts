import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './agent.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateUserDto } from './dto/update-agent.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  AppStandardApiHeaders,
  CustomAPIErrorResponse,
  StandardAPIErrorResponse,
} from 'src/common/decorators';
import { DatabaseLoggingInterceptor } from 'src/common';
import { LoginDto, LoginResponseDto } from '../auth-agent/dto/login.dto';

@Controller('v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
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
  create(@Body() CreateAgentDto: CreateAgentDto) {
    return this.userService.create(CreateAgentDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
