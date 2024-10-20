/* eslint-disable camelcase */
export const FLIGHT_PROVIDERS = {
  DEFAULT: 'Amadeus',
  AMADEUS: 'Amadeus',
  SABRE: 'Sabre',
};
export const DEFAULT_FLIGHT_PROVIDER_ID = 1;

export const FLIGHT_AMADEUS_ACTIONS = {
  Fare_FlexPricerUpsell: 'FFPRQT_17_2_1A',
  Fare_InformativePricingWithoutPNR: 'TIPNRQ_18_1_1A',
  Fare_MasterPricerTravelBoardSearch: 'FMPTBQ_17_3_1A',
  PNR_AddMultiElements: 'PNRADD_16_1_1A',
  Fare_PricePNRWithBookingClass: 'TPCBRQ_18_1_1A',
  Ticket_CreateTSTFromPricing: 'TAUTCQ_04_1_1A',
  Service_IntegratedPricing: 'TPISGQ_17_1_1A',
  Ticket_DisplayTST: 'TTSTRQ_15_1_1A',
  Ticket_DisplayTSMP: 'TTSMRQ_13_1_1A',
  Ticket_RetrieveListOfTSM: 'TTSLRQ_09_1_1A',
  Air_RetrieveSeatMap: 'SMPREQ_17_1_1A',
  PNR_Retrieve_16: 'PNRRET_16_1_1A',
  PNR_CreateAuxiliarySegment: 'PAUXCQ_09_1_1A',
  Ticket_CreateManualTSMP: 'TTSMCQ_15_1_1A',
  Ticket_UpdateTSMP: 'TTSMUQ_14_1_1A',
  FOP_CreateFormOfPayment: 'TFOPCQ_15_4_1A',
  DocIssuance_IssueCombined: 'TCTMIQ_15_1_1A',
  DocIssuance_IssueTicket: 'TTKTIQ_15_1_1A',
  DocIssuance_IssueMiscellaneousDocuments: 'TMDSIQ_15_1_1A',
  Ticket_CancelDocument: 'TRCANQ_11_1_1A',
  PNR_Cancel: 'PNRXCL_17_1_1A',
  PNR_Retrieve_17: 'PNRRET_17_1_1A',
  Service_StandaloneCatalogue: 'TPSCGQ_16_1_1A',
  Ticket_CreateTSMFromPricing: 'TAUSCQ_09_1_1A',
  Fare_GetFareRules: 'FARQNQ_07_1_1A',
  Ticket_ProcessEDoc: 'TATREQ_20_1_1A',
};

export const FLIGHT_AMADEUS_CONFIG = {
  ListAccountCodes: {
    EY: 399236,
    MH: 967128,
  },
  priceTypes: {
    flight: {
      EY: ['RP', 'RW', 'RU', 'TAN', 'CUC'],
      default: ['RP', 'RU', 'TAC', 'CUC'],
    },
    stopover: {
      EY: ['RP', 'RW', 'RU', 'TAN', 'CUC'],
      default: ['RP', 'RU', 'TAC', 'CUC'],
    },
  },
  mapPaxType: {
    EY: {
      IIT: 'ADT',
      ADT: 'ADT',
      INN: 'CHD',
      INF: 'INF',
    },
    default: {
      ADT: 'ADT',
      CH: 'CHD',
      INF: 'INF',
    },
  },
  reMapPaxType: {
    EY: {
      ADT: 'IIT',
      CHD: 'INN',
      INF: 'INF',
    },
    default: {
      ADT: 'ADT',
      CHD: 'CH',
      INF: 'INF',
    },
  },
  paxMap: {
    EY: {
      adult: 'IIT',
      child: 'INN',
      infant: 'INF',
      senior: 'SRC',
      disabled: 'DIS',
    },
    default: {
      adult: 'ADT',
      child: 'CHD',
      infant: 'INF',
      senior: 'SRC',
      disabled: 'DIS',
    },
  },
  respPaxTypeMap: {
    EY: {
      ADT: 'ADT',
      IIT: 'ADT',
      INN: 'CHD',
      CH: 'CHD',
      IN: 'INF',
      INF: 'INF',
      CD: 'SCR',
      IC: 'PWD',
    },
    default: {
      ADT: 'ADT',
      CH: 'CHD',
      IN: 'INF',
      CD: 'SCR',
      IC: 'PWD',
    },
  },
  baggageAllowancePaxtype: {
    EY: {
      IIT: 'adt',
      INN: 'chd',
      INF: 'inf',
    },
    default: {
      ADT: 'adt',
      CHD: 'chd',
      INF: 'inf',
    },
  },
  orderPassengerType: {
    EY: ['IIT', 'IT', 'IIN'],
    default: ['ADT', 'CH', 'CHD'],
  },
};

export const FLIGHT_AMADEUS_CABIN_CLASS_MAPPING = {
  Business: 'C',
  First: 'F',
  'Premium Economy': 'W',
  Economy: 'Y',
};

export const DIRECTION_MAPPING = {
  outbound: 'outbound',
  inbound: 'inbound',
};

export const TECHNICAL_STOP_QUALIFIER = {
  arrival: 'AA',
  departure: 'AD',
};

export const PAX_MAP = {
  adult: 'ADT',
  child: 'CHD',
  infant: 'INF',
  senior: 'SRC',
  disabled: 'DIS',
};

export const PAX_TYPE_MAP = {
  ADT: 'ADT',
  CH: 'CHD',
  IN: 'INF',
  CD: 'SCR',
  IC: 'PWD',
};

export const CABIN_CLASS_MAPPING = {
  Business: 'C',
  First: 'F',
  'Premium Economy': 'W',
  Economy: 'Y',
};

export const CABIN_CLASS_NAME_MAPPING = {
  C: 'Business',
  F: 'First',
  M: 'Economy',
  W: 'Premium Economy',
  Y: 'Economy',
};

export const DURATION_MAP = {
  DOH_CDG: 415,
  // CDG_DOH: 390,
  DOH_AMS: 435,
  AKL_DOH: 1070,
  DOH_BRU: 400,
  DOH_ARN: 380,
  ARN_DOH: 360,
  DOH_LHR: 435,
  LHR_DOH: 405,
  PEK_DOH: 545,
  DOH_PEK: 460,
  DOH_JFK: 845,
  JFK_DOH: 735,
  FRA_DOH: 355,
  DOH_FRA: 400,
  // DOH_HKT: 395,
  HKT_DOH: 445,
};
