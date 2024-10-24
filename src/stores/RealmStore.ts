import { create } from "zustand";
import axiosIstance from "@/lib/axios";
import { Realm } from "@/types";

export interface RealmsState {
  realms: Realm[];
  activeRealm: Realm | null;
  loading: boolean;
  submitting: boolean;
  error: string | null;
  fetchRealms: () => Promise<void>;
  createRealm: (realm: Partial<Realm>) => Promise<Realm | undefined>;
  setActiveRealm: (realm: Realm) => void;
}

export const useRealmsStore = create<RealmsState>((set, get) => ({
  realms: [],
  activeRealm: null,
  loading: false,
  submitting: false,
  error: null,
  fetchRealms: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosIstance.get<Realm[]>("/realms");
      set({ realms: response.data });
    } catch (error) {
      set({ error: "Failed to fetch realms. Please try again." });
      console.error("Fetching realms failed", error);
    } finally {
      set({ loading: false });
    }
  },
  createRealm: async (realm: Partial<Realm>) => {
    if (realm.name?.trim() === "") {
      set({ error: "Oops! Your realm needs a name. Don't be shy!" });
      return;
    }
    let newRealm: Realm | null = null;

    set({ submitting: true, error: null });
    try {
      const response = await axiosIstance.post<Realm>("/realms", realm);
      newRealm = response.data;
      set({ realms: [response.data, ...get().realms] });
    } catch (error) {
      set({ error: "Failed to create realm. Please try again." });
      console.error("Creating realm failed", error);
      throw error;
    } finally {
      set({ submitting: false });
    }
    return newRealm;
  },
  setActiveRealm: (realm: Realm) => set({ activeRealm: realm }),
}));
