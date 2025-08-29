import { create } from "zustand";

interface UiState {
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
  unread: number;
  setUnread: (n: number) => void;
}

export const useStore = create<UiState>((set) => ({
  theme: 'light',
  setTheme: (t) => set({ theme: t }),
  unread: 0,
  setUnread: (n) => set({ unread: n }),
}));
