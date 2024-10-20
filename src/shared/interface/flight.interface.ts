export interface FlightProvider {
  id: number;
  product: string;
  code: string;
  source_id: string | null;
  name: string | null;
  contract_by: string | null;
  airline_code: string;
  username: string | null;
  password: string | null;
  url: string | null;
  del_flag: boolean;
  agency_code: string | null;
  travel_agent_username: string | null;
  travel_agent_password: string | null;
  role_code: string | null;
  channel: string | null;
  timeout: number;
  default_currency: string | null;
  on_hold: boolean;
  is_callback: boolean;
  use_default_currency: boolean;
  custom_config: Record<string, any> | null;
  on_hold_minutes: number;
  mock_booking: boolean;
  client_id: string | null;
  client_secret: string | null;
}

export interface FlightSession {
  'awsse:Session': {
    '@TransactionStatusCode': string;
    '@xmlns:awsse'?: string;
    'awsse:SessionId'?: string;
    'awsse:SequenceNumber'?: string;
    'awsse:SecurityToken'?: string;
  };
}
