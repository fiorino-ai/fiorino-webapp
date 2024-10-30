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
  created_at: Date;
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
  id?: string;
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

export interface Account {
  id: string;
  external_id: string;
  created_at: Date;
  data: Record<string, string>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total_items: number;
    current_page: number;
    items_per_page: number;
    total_pages: number;
  };
}

export interface AccountsFilter {
  page?: number;
  limit?: number;
  search?: string;
}

export interface MonthRange {
  from: Date;
  to: Date;
}
