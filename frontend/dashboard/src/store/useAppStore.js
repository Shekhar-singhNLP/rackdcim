import { create } from "zustand";

/**
 * Global UI state — NOT server data (that's React Query's job).
 * This store holds cross-page UI state like which device is
 * currently selected, so any page can read/update it without
 * prop-drilling.
 */
export const useAppStore = create((set) => ({
  selectedDeviceId: null,
  setSelectedDeviceId: (id) => set({ selectedDeviceId: id }),

  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}));