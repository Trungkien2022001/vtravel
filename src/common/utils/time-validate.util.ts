import { BaseHotelSeachRequestDto } from 'src/shared/dtos';
import * as moment from 'moment';
import { AppError } from '../errors';
import { DEFAULT_DATE_FORMAT, SEARCH_ERROR } from 'src/shared/constants';
import { FlightSearchDto } from 'src/modules/flight-available/dto';

export function ValidateHotelSearchRequest(
  req: BaseHotelSeachRequestDto,
): void {
  if (
    moment(req.checkin, DEFAULT_DATE_FORMAT).isBefore(moment().startOf('day'))
  ) {
    throw new AppError(SEARCH_ERROR.INVALID_CHECKIN_DATE);
  }

  if (
    moment(req.checkout, DEFAULT_DATE_FORMAT).isBefore(
      moment(req.checkin, DEFAULT_DATE_FORMAT),
    )
  ) {
    throw new AppError(SEARCH_ERROR.INVALID_CHECKOUT_DATE);
  }
}

export function ValidateFlightSearchRequest(req: FlightSearchDto): void {
  if (
    moment(req.departure_date, DEFAULT_DATE_FORMAT).isBefore(
      moment().startOf('day'),
    )
  ) {
    throw new AppError(SEARCH_ERROR.INVALID_DEPARTURE_DATE);
  }

  if (
    moment(req.return_date, DEFAULT_DATE_FORMAT).isBefore(
      moment(req.departure_date, DEFAULT_DATE_FORMAT),
    )
  ) {
    throw new AppError(SEARCH_ERROR.INVALID_RETURN_DATE);
  }
}
