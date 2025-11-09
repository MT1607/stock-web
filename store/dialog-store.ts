import { create } from 'zustand';

interface DialogState {
  isOpen: boolean;
  data?: any;
  handleOpenChange: () => void;
  openDialog: () => void;
  closeDialog: () => void;
}

export const useDialogStore = create<DialogState>((set, get) => ({
  isOpen: false,
  data: null,
  openDialog: () => set({ isOpen: true }),
  closeDialog: () => set({ isOpen: false, data: null }),
  handleOpenChange: () => set({ isOpen: !get().isOpen }),
}));
