'use client';
import { useDialogStore } from '@/store/dialog-store';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { QuoteStock } from '@/types';
import { useEffect } from 'react';
import { ChevronDown, ChevronUp, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

const StockDialog = ({
  quoteData,
  symbol,
}: {
  quoteData: QuoteStock;
  symbol: string;
}) => {
  const { isOpen, closeDialog } = useDialogStore();
  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>Stock Quote</DialogTitle>
          <DialogDescription>Detail price of stock</DialogDescription>
        </DialogHeader>
        <>
          {quoteData.dp ? (
            <>
              <div className="flex w-full items-center justify-between px-4 sm:px-8">
                <h1
                  className={cn(
                    'font-bold',
                    quoteData.c > quoteData.pc
                      ? 'text-green-500'
                      : quoteData.c < quoteData.pc
                        ? 'text-red-500'
                        : 'text-yellow-500'
                  )}
                >
                  {symbol}
                </h1>
                <span
                  className={cn(
                    'inline-flex items-center justify-center font-bold',
                    quoteData.c > quoteData.pc
                      ? 'text-green-500'
                      : quoteData.c < quoteData.pc
                        ? 'text-red-500'
                        : 'text-yellow-500'
                  )}
                >
                  {quoteData.c.toFixed(2)}
                  USD
                </span>
                <span
                  className={cn(
                    'inline-flex items-center justify-center font-bold',
                    quoteData.dp < 0 ? 'text-red-500' : 'text-green-500'
                  )}
                >
                  {quoteData.dp < 0 ? <ChevronDown /> : <ChevronUp />}
                  {quoteData.dp.toFixed(2)}% ({quoteData.d.toFixed(2)})
                </span>
              </div>
              <div className="grid w-full grid-cols-12 gap-x-2">
                <div className="col-span-8 h-[200px] w-full bg-blue-500"></div>
                <div className="col-span-4 h-[200px] w-full bg-red-500"></div>
              </div>
            </>
          ) : (
            <></>
          )}
        </>
      </DialogContent>
    </Dialog>
  );
};

export default StockDialog;
