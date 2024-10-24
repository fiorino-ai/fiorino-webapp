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
