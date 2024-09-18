import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { UserAdminService } from './user-admin.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Admin,
  AppStandardApiHeaders,
  CustomAPIErrorResponse,
  Roles,
  StandardAPIErrorResponse,
  User,
} from 'src/common/decorators';
import { DatabaseLoggingInterceptor } from 'src/common';
import { LoginDto, LoginResponseDto } from '../auth-agent/dto/login.dto';
import { CreateAdminAccountDto, UpdateAdminDto } from './dto';
import { AdminRolesGuard, SuperAdminGuard } from 'src/common/guards';
import { BaseAPIResponseDTO } from 'src/shared/dtos';
import { ERoles } from 'src/shared/enums';
import { IAdmin } from 'src/contracts';

@Controller('v1/admin/user')
@ApiTags('Admin User Component')
export class UserAdminController {
  constructor(private readonly userAdminService: UserAdminService) {}

  @Post('entrypoint')
  @UseGuards(SuperAdminGuard)
  @UseInterceptors(DatabaseLoggingInterceptor)
  @ApiOperation({ summary: 'Supper Admin create first admin account' })
  @AppStandardApiHeaders('X-KEY', 'X-VERSION')
  @ApiResponse({
    status: 200,
    description: 'Create new first admin account successfully.',
    type: BaseAPIResponseDTO,
  })
  @CustomAPIErrorResponse([
    'ROLE_ALREADY_EXISTED',
    'USER_ALREADY_EXISTED',
    'INERNAL_SERVER_ERROR',
  ])
  @StandardAPIErrorResponse()
  createFirstAdminAccount() {
    return this.userAdminService.entrypoint();
  }

  @Post()
  @Roles(ERoles.ADMIN_USER)
  @UseGuards(AdminRolesGuard)
  @UseInterceptors(DatabaseLoggingInterceptor)
  @ApiOperation({ summary: 'Supper Admin create new admin account' })
  @AppStandardApiHeaders('X-KEY', 'X-VERSION')
  @ApiBody({
    type: LoginDto,
    required: true,
    description: 'Create new admin account Body',
  })
  @ApiResponse({
    status: 200,
    description: 'Create new admin account successfully.',
    type: LoginResponseDto,
  })
  @CustomAPIErrorResponse(['VALIDATION_ERROR', 'UNAUTHORIZED'])
  @StandardAPIErrorResponse()
  createAdminAccount(
    @Body() body: CreateAdminAccountDto,
    @Admin('id') adminId: number,
  ) {
    return this.userAdminService.create(body, adminId);
  }

  @Get()
  findAll() {
    return this.userAdminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userAdminService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateAdminDto) {
    return this.userAdminService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userAdminService.remove(+id);
  }
}
