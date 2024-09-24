import { Module, Provider } from '@nestjs/common';
import { HotelMappingService } from './hotel-mapping.service';
const providers: Provider[] = [HotelMappingService];
@Module({
  providers,
  imports: [],
  exports: [...providers],
})
export class HotelMappingModule {}
