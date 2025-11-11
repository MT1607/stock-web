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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '../ui/input-group';
import DropdownListStock from './list-stock/dropdown-list-stock';

const StockFollow = () => {
  const { isOpen, handleOpenChange } = useDialogStore();

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
          <DropdownListStock />
        </DialogContent>

        {/* <InputGroup>
          <InputGroupInput placeholder="Select your stock ..." />
          <InputGroupAddon
            align={'inline-end'}
            className="hover:cursor-pointer"
          >
            <ChevronDown />
          </InputGroupAddon>
        </InputGroup> */}
      </Dialog>
    </div>
  );
};

export default StockFollow;
