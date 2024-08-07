import { create } from "zustand";

interface Store {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const store = create<Store>((set) => ({
  loading: false,
  setLoading: (loading) => set({ loading })
}));