import { create } from 'zustand';

interface DialogState {
  isOpen: boolean;
  data?: any;
  openDialog: () => void;
  closeDialog: () => void;
}

export const useDialogStore = create<DialogState>((set) => ({
  isOpen: false,
  data: null,
  openDialog: () => set({ isOpen: true }),
  closeDialog: () => set({ isOpen: false, data: null }),
}));
