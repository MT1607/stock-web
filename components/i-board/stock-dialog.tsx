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
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>Stock Quote</DialogTitle>
          <DialogDescription>Detail price of stock</DialogDescription>
        </DialogHeader>
        <div className="grid w-full grid-cols-12 gap-x-2">
          <div className="col-span-8 h-[200px] w-full bg-blue-500"></div>
          <div className="col-span-4 h-[200px] w-full bg-red-500"></div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StockDialog;
