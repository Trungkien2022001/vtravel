import { PartialType } from '@nestjs/swagger';
import { CreateAdminAccountDto } from './create-user.dto';

export class UpdateAdminDto extends PartialType(CreateAdminAccountDto) {}
