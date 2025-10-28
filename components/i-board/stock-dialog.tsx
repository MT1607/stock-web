import { useDialogStore } from '@/store/dialog-store';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

const StockDialog = () => {
  const { isOpen, closeDialog } = useDialogStore();
  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Stock Quote</DialogTitle>
          <DialogDescription>Detail price of stock</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default StockDialog;
