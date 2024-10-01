import { SearchByRegionDto } from 'src/modules/hotel-available/dto';
import { HotelDetailDto } from 'src/modules/hotel-detail/dto';
import { TourDetailDto } from 'src/modules/tour-detail/dto';

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

export function buildTourDetailCacheKey(body: TourDetailDto): string {
  let key = `h${body.tour_id}`;
  key += `:i${body.checkin}`;
  key += `:p${body.adult}${body.children}${body.infant}`;

  return key;
}

export function buildVehicleDetailCacheKey(body: TourDetailDto): string {
  let key = `h${body.tour_id}`;
  key += `:i${body.checkin}`;
  key += `:p${body.adult}${body.children}${body.infant}`;

  return key;
}
