import { create } from "zustand";
import axios from "@/lib/axios";
import { Realm } from "@/types";

interface RealmsState {
  realms: Realm[];
  activeRealm: Realm | null;
  loading: boolean;
  error: string | null;
  fetchRealms: () => Promise<void>;
  setActiveRealm: (realm: Realm) => void;
}

export const useRealmsStore = create<RealmsState>((set) => ({
  realms: [],
  activeRealm: null,
  loading: false,
  error: null,
  fetchRealms: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get<Realm[]>("/realms");
      set({ realms: response.data });
    } catch (error) {
      set({ error: "Failed to fetch realms. Please try again." });
      console.error("Fetching realms failed", error);
    } finally {
      set({ loading: false });
    }
  },
  setActiveRealm: (realm: Realm) => set({ activeRealm: realm }),
}));
