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
}

export const useRealmDataStore = create<RealmDataState>((set) => ({
  costKPI: null,
  activityKPI: null,
  apiKeys: [],
  billLimits: [],
  loading: false,
  submitting: false,
  error: null,
  reset: () =>
    set({ costKPI: null, activityKPI: null, apiKeys: [], billLimits: [] }),
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
  overheads: [],
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
}));
