export interface User {
  id: string;
  email: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Realm {
  id: string;
  name: string;
  bill_limit_enabled: boolean;
  overhead_enabled: boolean;
}

export interface RealmCostKPI {
  [key: string]: any;
}

export interface RealmActivityKPI {
  [key: string]: any;
}

export interface ApiKey {
  id: string;
  name: string;
  masked: string;
  is_disabled: boolean;
  disabled_at: Date | null;
  value?: string;
}

export type NewApiKey = Pick<ApiKey, "name">;
export type EditedApiKey = Pick<ApiKey, "name" | "is_disabled">;

export interface BillLimit {
  id?: string; // Add this if the API returns an id
  valid_from: string;
  valid_to: string;
  amount: number;
}

export interface Overhead {
  id?: string;
  valid_from: string;
  valid_to: string;
  amount: number;
}
