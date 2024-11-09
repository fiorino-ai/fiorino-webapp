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
  model_name: string;
  total_cost: number;
}

export interface DailyModelCost {
  date: string;
  cost: number;
}

export interface ModelDailyCost {
  provider_name: string;
  model_name: string;
  daily_costs: DailyModelCost[];
}

export interface ModelUsage {
  provider_name: string;
  model_name: string;
  total_model_price: number;
  total_tokens: number;
}

export interface LLM {
  provider_name: string;
  model_name: string;
}

export interface RealmCostKPI {
  daily_costs: DailyModelTotalCost[];
  model_costs: ModelDailyCost[];
  most_used_models: ModelUsage[];
  total_cost: number;
  total_usage_fees: number;
  llms: LLM[];
  budget: {
    current_budget: number;
    budget_usage_percentage: number;
  };
}

export interface ChartCostSerie {
  date: string;
  [model_name: string]: string | number;
}

export interface ChartCostData {
  [date: string]: {
    [model_name: string]: number;
  };
}

export interface ChartTokensData {
  [date: string]: {
    total_input_tokens: number;
    total_output_tokens: number;
  };
}

export interface DailyTotalTokens {
  date: string;
  total_input_tokens: number;
  total_output_tokens: number;
}

export interface ModelDailyTokens {
  model_name: string;
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

export interface BillLimitHistory {
  id: string;
  amount: number;
  valid_from: Date;
  valid_to: Date | null;
}

export interface BillLimit {
  id: string;
  amount: number;
  valid_from: Date;
  valid_to: Date | null;
  realm_id: string;
  history: BillLimitHistory[];
}

export interface OverheadHistory {
  id: string;
  percentage: number;
  valid_from: Date;
  valid_to: Date | null;
}

export interface Overhead {
  id: string;
  percentage: number;
  valid_from: Date;
  valid_to: Date | null;
  realm_id: string;
  history: OverheadHistory[];
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
export interface UsageFilter {
  type: "model" | "account";
  id: string;
  value?: string;
}

export interface LLMCostHistory {
  id: string;
  price_per_unit: number;
  unit_type: string;
  overhead: number;
  valid_from: Date;
  valid_to: Date;
}

export interface LLMCost {
  id: string;
  provider_name: string;
  model_name: string;
  price_per_unit: number;
  unit_type: string;
  overhead: number;
  valid_from: Date;
  valid_to: Date;
  cost_id: string;
  history: LLMCostHistory[];
}

export interface UsageLogRequest {
  realm_id: string;
  external_id: string;
  input_tokens: number;
  output_tokens: number;
  provider_name: string;
  llm_model_name: string;
}

export interface UsageLogResponse {
  usage: {
    id: number;
    realm_id: string;
    account_id: string;
    api_key_id: string;
    created_at: string;
    llm_cost_id: string;
    total_price: number;
    input_tokens: number;
    total_tokens: number;
    output_tokens: number;
    total_model_price: number;
  };
  message: string;
}

export interface UsageLog {
  id: string;
  path: string;
  method: string;
  status_code: number;
  origin: string | null;
  request_body: UsageLogRequest;
  response_body: UsageLogResponse;
  created_at: Date;
}

export interface UsageLogsResponse {
  logs: UsageLog[];
  total: number;
  has_more: boolean;
}
