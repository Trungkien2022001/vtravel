/* eslint-disable @typescript-eslint/naming-convention */
export const REDIS_KEY = {
  AGENT_LOGIN: 'agent_login',
  AGENT_RESOURCES: 'agent_resources',
  HOTEL_BY_AIRPORT_CODE: 'hotel_by_airport',
  DESTINATION_TO_REGION: 'dest2region',
  HOTEL_IDS_FROM_REGION: 'hotelids',
  HOTEL_ROOMS_FROM_SEARCH_REQUEST: 'hotelroom',
  HOTEL_AVAIL_RATE: 'hotelavailrate',
  TOUR_AVAIL_RATE: 'touravailrate',
  VEHICLE_AVAIL_RATE: 'vehicleavailrate',
  HOTEL_RATES_FROM_SEARCH_REQUEST: 'hotelrate',
  CURRENCY: 'currency',
  CURRENCIES: 'currencies',
};
export const REDIS_EXPIRED = {
  '1_MINUTES': 60,
  '2_MINUTES': 120,
  '5_MINUTES': 300,
  '10_MINUTES': 600,
  '1_HOURS': 3600,
  '2_HOURS': 7200,
  '6_HOURS': 21600,
  '1_DAYS': 86400,
  '1_WEEKS': 604800,
  '1_MONTHS': 2592000,
};
