import { create } from "zustand";
import axios from "@/lib/axios";
import {
  ApiKey,
  EditedApiKey,
  NewApiKey,
  RealmActivityKPI,
  RealmCostKPI,
  BillLimit,
  Overhead,
  Account,
  AccountsFilter,
  PaginatedResponse,
  MonthRange,
  UsageFilter,
  LLMCost,
  UsageLog,
  UsageLogsResponse,
} from "@/types";
import { formatDateToISO, getMonthRange } from "@/lib/date";

export interface RealmDataState {
  costKPI: RealmCostKPI | null;
  activityKPI: RealmActivityKPI | null;
  kpiPeriod: MonthRange;
  kpiFilters: UsageFilter[];
  apiKeys: ApiKey[];
  billLimits: BillLimit | null;
  loading: boolean;
  submitting: boolean;
  error: string | null;
  reset: () => void;
  fetchCostKPI: (realmId: string) => Promise<void>;
  fetchActivityKPI: (realmId: string) => Promise<void>;
  fetchApiKeys: (realmId: string) => Promise<void>;
  createApiKey: (realmId: string, data: NewApiKey) => Promise<ApiKey | null>;
  updateApiKey: (
    realmId: string,
    apiKeyId: string,
    data: EditedApiKey
  ) => Promise<void>;
  deleteApiKey: (realmId: string, apiKeyId: string) => Promise<void>;
  fetchBillLimits: (realmId: string) => Promise<void>;
  createBillLimit: (realmId: string, data: Partial<BillLimit>) => Promise<void>;
  updateBillLimit: (
    realmId: string,
    billLimitId: string,
    data: Partial<BillLimit>
  ) => Promise<void>;
  deleteBillLimit: (
    realmId: string,
    billLimitId: string,
    reopenPreviousPrice: boolean
  ) => Promise<void>;
  overhead: Overhead | null;
  fetchOverhead: (realmId: string) => Promise<void>;
  createOverhead: (realmId: string, data: Partial<Overhead>) => Promise<void>;
  updateOverhead: (
    realmId: string,
    overheadId: string,
    data: Partial<Overhead>
  ) => Promise<void>;
  deleteOverhead: (realmId: string, overheadId: string) => Promise<void>;
  accounts: Account[];
  accountsTotal: number;
  accountsPage: number;
  accountsPages: number;
  accountsLoading: boolean;
  fetchAccounts: (realmId: string, filter?: AccountsFilter) => Promise<void>;
  getAccount: (realmId: string, accountId: string) => Promise<Account | null>;
  updateAccount: (
    realmId: string,
    accountId: string,
    data: Partial<Account>
  ) => Promise<void>;
  deleteAccount: (realmId: string, accountId: string) => Promise<void>;
  setKpiPeriod: (range: MonthRange) => void;
  setKpiFilters: (filters: UsageFilter[]) => void;
  llmCosts: LLMCost[];
  fetchLLMPricing: (realmId: string) => Promise<void>;
  createLLMCost: (realmId: string, data: Partial<LLMCost>) => Promise<void>;
  updateLLMCost: (
    realmId: string,
    costId: string,
    data: Partial<LLMCost>
  ) => Promise<void>;
  deleteLLMCost: (
    realmId: string,
    costId: string,
    reopenPreviousPrice: boolean
  ) => Promise<void>;
  logs: UsageLog[];
  logsTotal: number;
  logsHasMore: boolean;
  logsLoading: boolean;
  logsError: string | null;
  fetchLogs: (realmId: string, reset?: boolean) => Promise<void>;
  resetLogs: () => void;
}

export const useRealmDataStore = create<RealmDataState>((set, get) => ({
  costKPI: null,
  activityKPI: null,
  kpiPeriod: getMonthRange(new Date()),
  kpiFilters: [],
  apiKeys: [],
  billLimits: null,
  overhead: null,
  accounts: [],
  accountsTotal: 0,
  accountsPage: 1,
  accountsPages: 1,
  accountsLoading: false,
  loading: false,
  submitting: false,
  error: null,
  llmCosts: [],
  logs: [],
  logsTotal: 0,
  logsHasMore: true,
  logsLoading: false,
  logsError: null,
  reset: () =>
    set({
      costKPI: null,
      activityKPI: null,
      apiKeys: [],
      billLimits: null,
      accounts: [],
      overhead: null,
      logs: [],
      logsTotal: 0,
      logsHasMore: true,
      logsLoading: false,
      logsError: null,
    }),
  fetchCostKPI: async (realmId: string) => {
    const { kpiPeriod, kpiFilters } = get();
    set({ loading: true, costKPI: null, error: null });
    try {
      const params = new URLSearchParams({
        start_date: formatDateToISO(kpiPeriod.from),
        end_date: formatDateToISO(kpiPeriod.to),
      });

      kpiFilters.forEach((filter) => {
        params.append(
          filter.type === "account" ? "account_id" : "model_id",
          filter.id
        );
      });

      const response = await axios.get<RealmCostKPI>(
        `/realms/${realmId}/usage/cost?${params.toString()}`
      );
      set({ costKPI: response.data });
    } catch (error) {
      set({ error: "Failed to fetch realm details. Please try again." });
      console.error("Fetching realm details failed", error);
    } finally {
      set({ loading: false });
    }
  },
  fetchActivityKPI: async (realmId: string) => {
    const { kpiPeriod, kpiFilters } = get();
    set({ loading: true, activityKPI: null, error: null });
    try {
      const params = new URLSearchParams({
        start_date: formatDateToISO(kpiPeriod.from),
        end_date: formatDateToISO(kpiPeriod.to),
      });

      kpiFilters.forEach((filter) => {
        params.append(
          filter.type === "account" ? "account_id" : "model_id",
          filter.id
        );
      });

      const response = await axios.get<RealmActivityKPI>(
        `/realms/${realmId}/usage/activity?${params.toString()}`
      );
      set({ activityKPI: response.data });
    } catch (error) {
      set({ error: "Failed to fetch realm details. Please try again." });
      console.error("Fetching realm details failed", error);
    } finally {
      set({ loading: false });
    }
  },
  fetchApiKeys: async (realmId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get<ApiKey[]>(`/realms/${realmId}/api-keys`);
      set({ apiKeys: response.data });
    } catch (error) {
      set({ error: "Failed to fetch API keys. Please try again." });
      console.error("Fetching API keys failed", error);
    } finally {
      set({ loading: false });
    }
  },
  createApiKey: async (realmId: string, data: NewApiKey) => {
    set({ submitting: true, error: null });
    let newApiKey: ApiKey | null = null;
    try {
      const response = await axios.post<ApiKey>(
        `/realms/${realmId}/api-keys`,
        data
      );
      newApiKey = response.data as ApiKey;
      set((state) => ({ apiKeys: [...state.apiKeys, response.data] }));
    } catch (error) {
      set({ error: "Failed to create API key. Please try again." });
      console.error("Creating API key failed", error);
    } finally {
      set({ submitting: false });
    }
    return newApiKey;
  },
  updateApiKey: async (
    realmId: string,
    apiKeyId: string,
    payload: EditedApiKey
  ) => {
    set({ submitting: true, error: null });
    try {
      const response = await axios.patch<ApiKey>(
        `/realms/${realmId}/api-keys/${apiKeyId}`,
        payload
      );
      set((state) => ({
        apiKeys: state.apiKeys.map((apiKey) =>
          apiKey.id === apiKeyId ? response.data : apiKey
        ),
      }));
    } catch (error) {
      set({ error: "Failed to update API key. Please try again." });
      console.error("Updating API key failed", error);
    } finally {
      set({ submitting: false });
    }
  },
  deleteApiKey: async (realmId: string, apiKeyId: string) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`/realms/${realmId}/api-keys/${apiKeyId}`);
      set((state) => ({
        apiKeys: state.apiKeys.filter((apiKey) => apiKey.id !== apiKeyId),
      }));
    } catch (error) {
      set({ error: "Failed to delete API key. Please try again." });
      console.error("Deleting API key failed", error);
    } finally {
      set({ loading: false });
    }
  },
  fetchBillLimits: async (realmId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get<BillLimit>(
        `/realms/${realmId}/bill-limits`
      );

      const formattedLimits = {
        ...response.data,
        valid_from: new Date(response.data.valid_from),
        valid_to: response.data.valid_to
          ? new Date(response.data.valid_to)
          : null,
        history: response.data.history.map((historyItem) => ({
          ...historyItem,
          valid_from: new Date(historyItem.valid_from),
          valid_to: historyItem.valid_to
            ? new Date(historyItem.valid_to)
            : null,
        })),
      };

      set({ billLimits: formattedLimits });
    } catch (error) {
      set({ error: "Failed to fetch bill limits. Please try again." });
      console.error("Fetching bill limits failed", error);
    } finally {
      set({ loading: false });
    }
  },
  createBillLimit: async (realmId: string, data: Partial<BillLimit>) => {
    set({ submitting: true, error: null });
    try {
      // Set time components to zero for valid_from
      const validFrom = new Date(data.valid_from!);
      validFrom.setHours(0, 0, 0, 0);

      const payload = {
        ...data,
        valid_from: validFrom,
      };

      await axios.post<BillLimit>(`/realms/${realmId}/bill-limits`, payload);
      await get().fetchBillLimits(realmId);
    } catch (error) {
      set({ error: "Failed to create bill limit. Please try again." });
      console.error("Creating bill limit failed", error);
    } finally {
      set({ submitting: false });
    }
  },
  updateBillLimit: async (
    realmId: string,
    billLimitId: string,
    data: Partial<BillLimit>
  ) => {
    set({ submitting: true, error: null });
    try {
      await axios.put<BillLimit>(
        `/realms/${realmId}/bill-limits/${billLimitId}`,
        data
      );
      get().fetchBillLimits(realmId);
    } catch (error) {
      set({ error: "Failed to update bill limit. Please try again." });
      console.error("Updating bill limit failed", error);
    } finally {
      set({ submitting: false });
    }
  },
  deleteBillLimit: async (
    realmId: string,
    billLimitId: string,
    reopenPreviousPrice: boolean
  ) => {
    set({ submitting: true, error: null });
    try {
      await axios.delete(
        `/realms/${realmId}/bill-limits/${billLimitId}?reopen_previous_price=${reopenPreviousPrice}`
      );
      await get().fetchBillLimits(realmId);
    } catch (error) {
      set({ error: "Failed to delete bill limit. Please try again." });
      console.error("Deleting bill limit failed", error);
    } finally {
      set({ submitting: false });
    }
  },
  fetchOverhead: async (realmId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get<Overhead>(
        `/realms/${realmId}/overheads`
      );

      const formattedOverhead = {
        ...response.data,
        valid_from: new Date(response.data.valid_from),
        valid_to: response.data.valid_to
          ? new Date(response.data.valid_to)
          : null,
        history: response.data.history.map((item) => ({
          ...item,
          valid_from: new Date(item.valid_from),
          valid_to: item.valid_to ? new Date(item.valid_to) : null,
        })),
      };

      set({ overhead: formattedOverhead });
    } catch (error) {
      set({ error: "Failed to fetch overhead. Please try again." });
      console.error("Fetching overhead failed", error);
    } finally {
      set({ loading: false });
    }
  },
  createOverhead: async (realmId: string, data: Partial<Overhead>) => {
    set({ submitting: true, error: null });
    try {
      // Set time components to zero for valid_from
      const validFrom = new Date(data.valid_from!);
      validFrom.setHours(0, 0, 0, 0);

      const payload = {
        ...data,
        valid_from: validFrom,
      };

      await axios.post<Overhead>(`/realms/${realmId}/overheads`, payload);
      await get().fetchOverhead(realmId);
    } catch (error) {
      set({ error: "Failed to create overhead. Please try again." });
      console.error("Creating overhead failed", error);
    } finally {
      set({ submitting: false });
    }
  },
  updateOverhead: async (
    realmId: string,
    overheadId: string,
    data: Partial<Overhead>
  ) => {
    set({ submitting: true, error: null });
    try {
      await axios.put<Overhead>(
        `/realms/${realmId}/overheads/${overheadId}`,
        data
      );
      await get().fetchOverhead(realmId);
    } catch (error) {
      set({ error: "Failed to update overhead. Please try again." });
      console.error("Updating overhead failed", error);
    } finally {
      set({ submitting: false });
    }
  },
  deleteOverhead: async (realmId: string, overheadId: string) => {
    set({ submitting: true, error: null });
    try {
      await axios.delete(`/realms/${realmId}/overheads/${overheadId}`);
      await get().fetchOverhead(realmId);
    } catch (error) {
      set({ error: "Failed to delete overhead. Please try again." });
      console.error("Deleting overhead failed", error);
    } finally {
      set({ submitting: false });
    }
  },
  fetchAccounts: async (realmId: string, filter?: AccountsFilter) => {
    set({ accountsLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (filter?.page) params.append("page", filter.page.toString());
      if (filter?.limit) params.append("limit", filter.limit.toString());
      if (filter?.search) params.append("search", filter.search);

      const response = await axios.get<PaginatedResponse<Account>>(
        `/realms/${realmId}/accounts?${params.toString()}`
      );

      set({
        accounts: response.data.data,
        accountsTotal: response.data.pagination.total_items,
        accountsPage: response.data.pagination.current_page,
        accountsPages: response.data.pagination.total_pages,
      });
    } catch (error) {
      set({ error: "Failed to fetch accounts. Please try again." });
      console.error("Fetching accounts failed", error);
    } finally {
      set({ accountsLoading: false });
    }
  },
  getAccount: async (realmId: string, accountId: string) => {
    // set({ loading: true, error: null });
    try {
      const response = await axios.get<Account>(
        `/realms/${realmId}/accounts/${accountId}`
      );
      return response.data;
    } catch (error) {
      set({ error: "Failed to fetch account details. Please try again." });
      console.error("Fetching account details failed", error);
      return null;
    }
    // finally {
    //   set({ loading: false });
    // }
  },
  updateAccount: async (
    realmId: string,
    accountId: string,
    data: Partial<Account>
  ) => {
    set({ submitting: true, error: null });
    try {
      const response = await axios.put<Account>(
        `/realms/${realmId}/accounts/${accountId}`,
        data
      );
      set((state) => ({
        accounts: state.accounts.map((account) =>
          account.id === accountId ? response.data : account
        ),
      }));
    } catch (error) {
      set({ error: "Failed to update account. Please try again." });
      console.error("Updating account failed", error);
    } finally {
      set({ submitting: false });
    }
  },
  deleteAccount: async (realmId: string, accountId: string) => {
    set({ submitting: true, error: null });
    try {
      await axios.delete(`/realms/${realmId}/accounts/${accountId}`);
      set((state) => ({
        accounts: state.accounts.filter((account) => account.id !== accountId),
        accountsTotal: state.accountsTotal - 1,
      }));
    } catch (error) {
      set({ error: "Failed to delete account. Please try again." });
      console.error("Deleting account failed", error);
    } finally {
      set({ submitting: false });
    }
  },
  setKpiPeriod: (range: MonthRange) => {
    set({ kpiPeriod: range });
  },
  setKpiFilters: (filters: UsageFilter[]) => {
    set({ kpiFilters: filters });
  },
  fetchLLMPricing: async (realmId: string) => {
    set({ loading: true, llmCosts: [], error: null });

    try {
      const response = await axios.get<LLMCost[]>(
        `/realms/${realmId}/llm-costs`
      );

      // Format dates in the response data
      const formattedCosts = response.data.map((cost) => ({
        ...cost,
        valid_from: new Date(cost.valid_from),
        valid_to: cost.valid_to ? new Date(cost.valid_to) : null,
        history: cost.history.map((historyItem) => ({
          ...historyItem,
          valid_from: new Date(historyItem.valid_from),
          valid_to: historyItem.valid_to
            ? new Date(historyItem.valid_to)
            : null,
        })),
      }));

      set({ llmCosts: formattedCosts });
    } catch (error) {
      set({ error: "Failed to fetch LLM pricing. Please try again." });
      console.error("Fetching llm pricing failed", error);
    } finally {
      set({ loading: false });
    }
  },
  createLLMCost: async (realmId: string, data: Partial<LLMCost>) => {
    set({ submitting: true, error: null });
    try {
      // Map the data to match API expectations
      const mappedData = {
        ...data,
        model_name: data.model_name, // Map model_name to model_name
      };

      const response = await axios.post<LLMCost>(
        `/realms/${realmId}/llm-costs`,
        mappedData
      );

      const newCost = {
        ...response.data,
        valid_from: new Date(response.data.valid_from),
        valid_to: response.data.valid_to
          ? new Date(response.data.valid_to)
          : null,
        history: response.data.history.map((item) => ({
          ...item,
          valid_from: new Date(item.valid_from),
          valid_to: item.valid_to ? new Date(item.valid_to) : null,
        })),
      };

      set((state) => ({
        llmCosts: [...state.llmCosts, newCost],
      }));
    } catch (error) {
      set({ error: "Failed to create LLM cost. Please try again." });
      console.error("Creating LLM cost failed", error);
    } finally {
      set({ submitting: false });
    }
  },
  updateLLMCost: async (
    realmId: string,
    costId: string,
    data: Partial<LLMCost>
  ) => {
    set({ submitting: true, error: null });
    try {
      // Map the data to match API expectations
      const mappedData = {
        ...data,
        model_name: data.model_name, // Map model_name to model_name
      };

      const response = await axios.put<LLMCost>(
        `/realms/${realmId}/llm-costs/${costId}`,
        mappedData
      );

      const updatedCost = {
        ...response.data,
        valid_from: new Date(response.data.valid_from),
        valid_to: response.data.valid_to
          ? new Date(response.data.valid_to)
          : null,
        history: response.data.history.map((item) => ({
          ...item,
          valid_from: new Date(item.valid_from),
          valid_to: item.valid_to ? new Date(item.valid_to) : null,
        })),
      };

      set((state) => ({
        llmCosts: state.llmCosts.map((cost) =>
          cost.id === costId ? updatedCost : cost
        ),
      }));
    } catch (error) {
      set({ error: "Failed to update LLM cost. Please try again." });
      console.error("Updating LLM cost failed", error);
    } finally {
      set({ submitting: false });
    }
  },
  deleteLLMCost: async (
    realmId: string,
    costId: string,
    reopenPreviousPrice: boolean
  ) => {
    set({ submitting: true, error: null });
    try {
      await axios.delete(
        `/realms/${realmId}/llm-costs/${costId}?reopen_previous_price=${reopenPreviousPrice}`
      );

      set((state) => ({
        llmCosts: state.llmCosts.filter((cost) => cost.id !== costId),
      }));
    } catch (error) {
      set({ error: "Failed to delete LLM cost. Please try again." });
      console.error("Deleting LLM cost failed", error);
    } finally {
      set({ submitting: false });
    }
  },
  fetchLogs: async (realmId: string, reset: boolean = false) => {
    const state = get();

    // Don't fetch if we're already loading or if we have no more data
    if (state.logsLoading || (!reset && !state.logsHasMore)) {
      return;
    }

    const limit = 20; // Number of logs per request
    const skip = reset ? 0 : state.logs.length;

    set({
      logsLoading: true,
      logsError: null,
      ...(reset ? { logs: [], logsHasMore: true } : {}),
    });

    try {
      const response = await axios.get<UsageLogsResponse>(
        `/realms/${realmId}/usage/logs?skip=${skip}&limit=${limit}`
      );

      const formattedLogs = response.data.logs.map((log) => ({
        ...log,
        created_at: new Date(log.created_at),
      }));

      set((state) => ({
        logs: reset ? formattedLogs : [...state.logs, ...formattedLogs],
        logsTotal: response.data.total,
        logsHasMore: response.data.has_more,
      }));
    } catch (error) {
      set({
        logsError: "Failed to fetch usage logs. Please try again.",
        logsHasMore: false,
      });
      console.error("Fetching usage logs failed", error);
    } finally {
      set({ logsLoading: false });
    }
  },
  resetLogs: () => {
    set({
      logs: [],
      logsTotal: 0,
      logsHasMore: true,
      logsError: null,
    });
  },
}));
