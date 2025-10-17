import { create } from 'zustand';

interface SidebarState {
  isCollapse: boolean;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isCollapse: false,
  toggleSidebar: () => set((state) => ({ isCollapse: !state.isCollapse })),
  openSidebar: () => set({ isCollapse: true }),
  closeSidebar: () => set({ isCollapse: false }),
}));
