import { create } from "zustand";
import axios from "@/lib/axios";
import { RealmActivityKPI, RealmCostKPI } from "@/types";

interface RealmDataState {
  costKPI: RealmCostKPI | null;
  activityKPI: RealmActivityKPI | null;
  loading: boolean;
  error: string | null;
  fetchCostKPI: (realmId: string) => Promise<void>;
  fetchActivityKPI: (realmId: string) => Promise<void>;
}

export const useRealmDataStore = create<RealmDataState>((set) => ({
  costKPI: null,
  activityKPI: null,
  loading: false,
  error: null,
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
}));
