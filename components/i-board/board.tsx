'use client';

import { useGetStockUS, useSearchStockUS } from '@/hooks/use-finhub';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { DataTable } from '../data-table';
import { columns } from './column-stock';
import useDebounce from '@/hooks/use-debounce';
import { ColumnDef } from '@tanstack/react-table';
import { ResListStocks, Stock } from '@/types';
import { Search } from 'lucide-react';
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from '../ui/input-group';
import StockDialog from './stock-dialog';
import { useDialogStore } from '@/store/dialog-store';
import { useFinnhubSocket } from '@/hooks/use-finhub-socket';

export const BoardComponent = ({
  dataAllStocks,
}: {
  dataAllStocks: ResListStocks;
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [localSymbol, setLocalSymbol] = useState('');

  const { openDialog } = useDialogStore();
  const { paginatedData, isLoading, totalPages } = useGetStockUS(
    currentPage,
    20,
    {
      fallbackData: currentPage === 1 ? dataAllStocks : [],
    }
  );

  const deboGlobalFilter = useDebounce(localSymbol, 300);
  const searchQuery =
    deboGlobalFilter.trim() !== '' ? deboGlobalFilter.trim() : null;

  const { searchData, isSearchLoading } = useSearchStockUS(searchQuery);
  const { trades, isConnect, currentSymbol } = useFinnhubSocket(selectedSymbol);

  useEffect(() => {
    if (searchQuery) {
      setCurrentPage(1);
    }
  }, [searchData]);

  useEffect(() => {
    console.log('trades: ', trades);
    console.log('isConnect: ', isConnect);
    console.log('currentSymbol: ', currentSymbol);
  }, [trades]);

  useEffect(() => {
    setLocalSymbol(deboGlobalFilter);
  }, [deboGlobalFilter]);

  const handleGetDetailStock = (data: any) => {
    openDialog();
    setSelectedSymbol(data?.symbol);
  };

  const handlePageChange = (newPage: number) => {
    let nextPageIndex = newPage;
    if (newPage < 1) {
      nextPageIndex = totalPages;
    } else if (newPage > totalPages) {
      nextPageIndex = 1;
    }
    setCurrentPage(nextPageIndex);
  };

  return (
    <div>
      <div>
        <InputGroup className="mb-4 w-full">
          <InputGroupInput
            placeholder="Search..."
            onChange={(e) => setLocalSymbol(e.target.value)}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          {searchData && (
            <InputGroupAddon align="inline-end">
              {searchData?.count} results
            </InputGroupAddon>
          )}
        </InputGroup>{' '}
        <DataTable
          columns={columns as ColumnDef<Stock, any>[]}
          data={searchData?.result || paginatedData}
          onRowDoubleClick={handleGetDetailStock}
          isLoading={isSearchLoading}
        />
      </div>
      {!isLoading && (
        <div className="mt-3 flex w-full justify-between">
          <Button
            variant={'ghost'}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Prev
          </Button>
          {totalPages && (
            <div className="flex items-center gap-2">
              <span>
                Page {currentPage} of {totalPages}
              </span>
            </div>
          )}
          <Button
            variant={'ghost'}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      )}

      <StockDialog />
    </div>
  );
};

export default BoardComponent;
