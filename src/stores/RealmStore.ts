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
  updateRealm: (id: string, data: Partial<Realm>) => Promise<void>;
  deleteRealm: (id: string) => Promise<void>;
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
      set({
        realms: response.data.map((r) => ({
          ...r,
          created_at: new Date(r.created_at),
        })),
      });
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
      newRealm = {
        ...response.data,
        created_at: new Date(response.data.created_at),
      };
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
  updateRealm: async (id: string, data: Partial<Realm>) => {
    set({ submitting: true, error: null });
    try {
      const response = await axiosIstance.put<Realm>(`/realms/${id}`, data);
      const updatedRealm = response.data;
      set((state) => ({
        realms: state.realms.map((realm) =>
          realm.id === id ? updatedRealm : realm
        ),
        activeRealm:
          state.activeRealm?.id === id ? updatedRealm : state.activeRealm,
      }));
    } catch (error) {
      set({ error: "Failed to update realm. Please try again." });
      console.error("Updating realm failed", error);
      throw error;
    } finally {
      set({ submitting: false });
    }
  },
  deleteRealm: async (id: string) => {
    set({ submitting: true, error: null });
    try {
      await axiosIstance.delete(`/realms/${id}`);
      set((state) => ({
        realms: state.realms.filter((realm) => realm.id !== id),
        activeRealm: state.activeRealm?.id === id ? null : state.activeRealm,
      }));
    } catch (error) {
      set({ error: "Failed to delete realm. Please try again." });
      console.error("Deleting realm failed", error);
      throw error;
    } finally {
      set({ submitting: false });
    }
  },
  setActiveRealm: (realm: Realm) => set({ activeRealm: realm }),
}));
