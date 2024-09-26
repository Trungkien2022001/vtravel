import { SearchByRegionDto } from 'src/modules/hotel-available/dto';
import { HotelDetailDto } from 'src/modules/hotel-detail/dto';

export function buildRegionSearchCacheKey(body: SearchByRegionDto): string {
  let key = `r${body.region_id}`;
  key += `:i${body.checkin}:${body.checkout}`;
  body.rooms.forEach((room) => {
    key += `:p${room.adult}${room.children}${room.infant}`;
  });

  return key;
}

export function buildHotelDetailCacheKey(body: HotelDetailDto): string {
  let key = `h${body.hotel_id}`;
  key += `:i${body.checkin}:${body.checkout}`;
  body.rooms.forEach((room) => {
    key += `:p${room.adult}${room.children}${room.infant}`;
  });

  return key;
}
