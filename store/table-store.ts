import { create } from 'zustand';

interface TableState {
  globalFilter: string;
  setGlobalFilter: (filter: string) => void;
}

export const useTableStore = create<TableState>((set) => ({
  globalFilter: '',
  setGlobalFilter: (filter: string) => set({ globalFilter: filter }),
}));
