import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './agent.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Admin,
  StandardApiHeaders,
  CustomAPIErrorResponse,
  Roles,
  StandardAPIErrorResponse,
  User,
} from 'src/common/decorators';
import { DatabaseLoggingInterceptor } from 'src/common';
import { LoginDto, LoginResponseDto } from '../auth-agent/dto';
import { ERoles } from 'src/shared/enums';
import { AdminRolesGuard } from 'src/common/guards';
import { AgentRolesGuard } from 'src/common/guards/agent.guard';
import { CreateAgentDto, CreateAgentResponseDto, UpdateUserDto } from './dto';

@Controller('v1/user')
@ApiTags('User Component')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(ERoles.ADMIN_USER)
  @UseGuards(AdminRolesGuard)
  @UseInterceptors(DatabaseLoggingInterceptor)
  @ApiOperation({ summary: 'Agent Login' })
  @StandardApiHeaders('X-KEY', 'X-VERSION', 'X-ACCESS-TOKEN', 'X-LANG')
  @ApiBody({
    type: CreateAgentDto,
    required: true,
    description: 'Login Body',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successfully.',
    type: CreateAgentResponseDto,
  })
  @CustomAPIErrorResponse(['VALIDATION_ERROR', 'UNAUTHORIZED'])
  @StandardAPIErrorResponse()
  createAgent(
    @Body() CreateAgentDto: CreateAgentDto,
    @Admin('id') adminId: number,
  ) {
    return this.userService.create(CreateAgentDto, adminId);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('me')
  @Roles(ERoles.AGENT_INFO)
  @UseGuards(AgentRolesGuard)
  @UseInterceptors(DatabaseLoggingInterceptor)
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
  me(@User('id') agentId: number) {
    return this.userService.findOne(agentId);
  }

  @Get(':id')
  @Roles(ERoles.ADMIN_USER)
  @UseGuards(AdminRolesGuard)
  @UseInterceptors(DatabaseLoggingInterceptor)
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
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }
}
