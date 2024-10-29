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
} from "@/types";

export interface RealmDataState {
  costKPI: RealmCostKPI | null;
  activityKPI: RealmActivityKPI | null;
  apiKeys: ApiKey[];
  billLimits: BillLimit[];
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
  createBillLimit: (
    realmId: string,
    data: BillLimit
  ) => Promise<BillLimit | null>;
  updateBillLimit: (
    realmId: string,
    billLimitId: string,
    data: Partial<BillLimit>
  ) => Promise<void>;
  deleteBillLimit: (realmId: string, billLimitId: string) => Promise<void>;
  overheads: Overhead[];
  fetchOverheads: (realmId: string) => Promise<void>;
  createOverhead: (realmId: string, data: Overhead) => Promise<Overhead | null>;
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
}

export const useRealmDataStore = create<RealmDataState>((set) => ({
  costKPI: null,
  activityKPI: null,
  apiKeys: [],
  billLimits: [],
  overheads: [],
  accounts: [],
  accountsTotal: 0,
  accountsPage: 1,
  accountsPages: 1,
  accountsLoading: false,
  loading: false,
  submitting: false,
  error: null,
  reset: () =>
    set({
      costKPI: null,
      activityKPI: null,
      apiKeys: [],
      billLimits: [],
      accounts: [],
      overheads: [],
    }),
  fetchCostKPI: async (realmId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get<RealmCostKPI>(
        `/realms/${realmId}/usage/cost?start_date=2024-09-01&end_date=2024-10-01`
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
    set({ loading: true, error: null });
    try {
      const response = await axios.get<RealmCostKPI>(
        `/realms/${realmId}/usage/activity?start_date=2024-09-01&end_date=2024-10-01`
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
      const response = await axios.get<BillLimit[]>(
        `/realms/${realmId}/bill-limits`
      );
      set({ billLimits: response.data });
    } catch (error) {
      set({ error: "Failed to fetch bill limits. Please try again." });
      console.error("Fetching bill limits failed", error);
    } finally {
      set({ loading: false });
    }
  },
  createBillLimit: async (realmId: string, data: BillLimit) => {
    set({ submitting: true, error: null });
    let newBillLimit: BillLimit | null = null;
    try {
      const response = await axios.post<BillLimit>(
        `/realms/${realmId}/bill-limits`,
        data
      );
      newBillLimit = response.data;
      set((state) => ({ billLimits: [...state.billLimits, newBillLimit!] }));
    } catch (error) {
      set({ error: "Failed to create bill limit. Please try again." });
      console.error("Creating bill limit failed", error);
    } finally {
      set({ submitting: false });
    }
    return newBillLimit;
  },
  updateBillLimit: async (
    realmId: string,
    billLimitId: string,
    data: Partial<BillLimit>
  ) => {
    set({ submitting: true, error: null });
    try {
      const response = await axios.put<BillLimit>(
        `/realms/${realmId}/bill-limits/${billLimitId}`,
        data
      );
      set((state) => ({
        billLimits: state.billLimits.map((billLimit) =>
          billLimit.id === billLimitId ? response.data : billLimit
        ),
      }));
    } catch (error) {
      set({ error: "Failed to update bill limit. Please try again." });
      console.error("Updating bill limit failed", error);
    } finally {
      set({ submitting: false });
    }
  },
  deleteBillLimit: async (realmId: string, billLimitId: string) => {
    set({ submitting: true, error: null });
    try {
      await axios.delete(`/realms/${realmId}/bill-limits/${billLimitId}`);
      set((state) => ({
        billLimits: state.billLimits.filter(
          (billLimit) => billLimit.id !== billLimitId
        ),
      }));
    } catch (error) {
      set({ error: "Failed to delete bill limit. Please try again." });
      console.error("Deleting bill limit failed", error);
    } finally {
      set({ submitting: false });
    }
  },
  fetchOverheads: async (realmId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get<Overhead[]>(
        `/realms/${realmId}/overheads`
      );
      set({ overheads: response.data });
    } catch (error) {
      set({ error: "Failed to fetch overheads. Please try again." });
      console.error("Fetching overheads failed", error);
    } finally {
      set({ loading: false });
    }
  },
  createOverhead: async (realmId: string, data: Overhead) => {
    set({ submitting: true, error: null });
    let newOverhead: Overhead | null = null;
    try {
      const response = await axios.post<Overhead>(
        `/realms/${realmId}/overheads`,
        data
      );
      newOverhead = response.data;
      set((state) => ({ overheads: [...state.overheads, newOverhead!] }));
    } catch (error) {
      set({ error: "Failed to create overhead. Please try again." });
      console.error("Creating overhead failed", error);
    } finally {
      set({ submitting: false });
    }
    return newOverhead;
  },
  updateOverhead: async (
    realmId: string,
    overheadId: string,
    data: Partial<Overhead>
  ) => {
    set({ submitting: true, error: null });
    try {
      const response = await axios.put<Overhead>(
        `/realms/${realmId}/overheads/${overheadId}`,
        data
      );
      set((state) => ({
        overheads: state.overheads.map((overhead) =>
          overhead.id === overheadId ? response.data : overhead
        ),
      }));
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
      set((state) => ({
        overheads: state.overheads.filter(
          (overhead) => overhead.id !== overheadId
        ),
      }));
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
    set({ loading: true, error: null });
    try {
      const response = await axios.get<Account>(
        `/realms/${realmId}/accounts/${accountId}`
      );
      return response.data;
    } catch (error) {
      set({ error: "Failed to fetch account details. Please try again." });
      console.error("Fetching account details failed", error);
      return null;
    } finally {
      set({ loading: false });
    }
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
}));
