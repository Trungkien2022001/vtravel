import { Controller, Post, UseGuards } from '@nestjs/common';
import { Roles } from 'src/common/decorators';
import { ERoles } from 'src/shared/enums';
import { AdminRolesGuard } from 'src/common/guards';
import { CurrencyService } from './services';
import { ApiTags } from '@nestjs/swagger';

@Controller('v1/currency')
@ApiTags('Currency Component')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Post('entrypoint')
  @Roles(ERoles.SUPER_ADMIN)
  @UseGuards(AdminRolesGuard)
  entryPoint() {}
}
