import { Module, Provider } from '@nestjs/common';
import { HotelMappingService } from './hotel-mapping.service';
import { RedisModule } from '../cache/redis';
const providers: Provider[] = [HotelMappingService];
@Module({
  providers,
  imports: [RedisModule],
  exports: [...providers],
})
export class HotelMappingModule {}
