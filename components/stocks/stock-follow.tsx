'use client';
import { ChevronDown, CirclePlus, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { useDialogStore } from '@/store/dialog-store';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Separator } from '../ui/separator';

import DropdownListStock from './list-stock/dropdown-list-stock';
import { useState } from 'react';

const StockFollow = () => {
  const { isOpen, handleOpenChange } = useDialogStore();
  const [valueStockFollow, setValueStockFollow] = useState<string[]>([]);

  const handleSave = () => {
    if (valueStockFollow.length === 0) {
      return;
    }
    console.log('Đang gọi API để lưu danh sách theo dõi:', valueStockFollow);
    handleOpenChange();
  };

  return (
    <div className="flex h-[500px] w-full items-center justify-center rounded border-2">
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button className="rounded bg-blue-500 hover:bg-blue-300">
            <CirclePlus />
            <p>Select stock to follow</p>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Stocks</DialogTitle>
            <DialogDescription>Select stock to follow</DialogDescription>
          </DialogHeader>
          <Separator />
          <DropdownListStock
            valueStockFollow={valueStockFollow}
            setValueStockFollow={setValueStockFollow}
          />
          <Separator />
          <div className="flex justify-end">
            <Button
              className="bg-blue-500 hover:bg-blue-300"
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StockFollow;
