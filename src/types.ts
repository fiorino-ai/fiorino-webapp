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

export interface DailyModelTotalCost {
  date: string;
  provider_name: string;
  llm_model_name: string;
  total_cost: number;
}

export interface DailyModelCost {
  date: string;
  cost: number;
}

export interface ModelDailyCost {
  provider_name: string;
  llm_model_name: string;
  daily_costs: DailyModelCost[];
}

export interface ModelUsage {
  provider_name: string;
  llm_model_name: string;
  total_model_price: number;
  total_tokens: number;
}

export interface LLM {
  provider_name: string;
  llm_model_name: string;
}

export interface RealmCostKPI {
  daily_costs: DailyModelTotalCost[];
  model_costs: ModelDailyCost[];
  most_used_models: ModelUsage[];
  total_cost: number;
  total_usage_fees: number;
  llms: LLM[];
}

export interface ChartCostSerie {
  date: string;
  [llm_model_name: string]: string | number;
}

export interface ChartCostData {
  [date: string]: {
    [llm_model_name: string]: number;
  };
}

export interface DailyTotalTokens {
  date: string;
  total_input_tokens: number;
  total_output_tokens: number;
}

export interface ModelDailyTokens {
  llm_model_name: string;
  data: DailyTotalTokens[];
}

export interface ApiKeyUsage {
  api_key_name: string;
  percentage: number;
  total_activity_records: number;
}

export interface TopApiKeys {
  total_events: number;
  api_keys: ApiKeyUsage[];
}

export interface UserUsage {
  account_id: string;
  account_name: string;
  percentage: number;
  total_activity_records: number;
}

export interface TopUsers {
  total_events: number;
  users: UserUsage[];
}

export interface RealmActivityKPI {
  daily_tokens: DailyTotalTokens[];
  model_daily_tokens: ModelDailyTokens[];
  top_api_keys: TopApiKeys;
  top_users: TopUsers;
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
