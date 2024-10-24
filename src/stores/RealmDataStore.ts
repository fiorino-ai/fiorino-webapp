import { create } from "zustand";
import axios from "@/lib/axios";
import {
  ApiKey,
  EditedApiKey,
  NewApiKey,
  RealmActivityKPI,
  RealmCostKPI,
} from "@/types";

export interface RealmDataState {
  costKPI: RealmCostKPI | null;
  activityKPI: RealmActivityKPI | null;
  apiKeys: ApiKey[];
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
}

export const useRealmDataStore = create<RealmDataState>((set) => ({
  costKPI: null,
  activityKPI: null,
  apiKeys: [],
  loading: false,
  submitting: false,
  error: null,
  reset: () => set({ costKPI: null, activityKPI: null, apiKeys: [] }),
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
}));
