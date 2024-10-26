export const DEFAULT_TRANSFER_PROVIDER_ID = 42;

export const TRANSFER_PROVIDERS = {
  DEFAULT: 'Hotelbeds',
  HOTELBEDS: 'Hotelbeds',
  TRANSFERZ: 'transferz',
};

export const TRANSFER_DATETIME_FORMAT = {
  dateFormat: {
    GoQuo: 'YYYY-MM-DD',
    GTA: 'YYYY-MM-DD',
    HMS: 'YYYYMMDD',
    HolidayTaxis: 'YYYY-MM-DD',
    HotelBeds: 'YYYYMMDD',
    Mozio: 'YYYY-MM-DD',
    Vibe: 'YYYY-MM-DD',
    HotelBedsV2: 'YYYY-MM-DD',
    Transferz: 'YYYY-MM-DD',
  },
  timeFormat: {
    GoQuo: 'HH:mm',
    GTA: 'HH.mm',
    HMS: 'HH:mm',
    HolidayTaxis: 'HH:mm:ss',
    HotelBeds: 'HHmm',
    Mozio: 'HH:mm',
    HotelBedsV2: 'HH:mm:ss',
    Transferz: 'HH:mm',
  },
  dateTimeFormat: {
    GoQuo: 'YYYY-MM-DD HH:mm',
    GTA: 'YYYY-MM-DD HH:mm',
    HMS: 'YYYYMMDD HH:mm',
    HolidayTaxis: 'YYYY-MM-DDTHH:mm:ss',
    HotelBeds: 'YYYYMMDD HHmm',
    Mozio: 'YYYY-MM-DD HH:mm',
    HotelBedsV2: 'YYYY-MM-DDTHH:mm:ss',
    Transferz: 'YYYY-MM-DD[T]HH:mm:ss',
  },
};
