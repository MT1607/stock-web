'use client';

import { useGetStockUS, useSearchStockUS } from '@/hooks/use-finhub';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { DataTable } from '../data-table';
import { columns } from './column-stock';
import { useTableStore } from '@/store/table-store';
import { Input } from '../ui/input';
import useDebounce from '@/hooks/use-debounce';
import { ColumnDef } from '@tanstack/react-table';
import { Stock } from '@/types';
import { Search } from 'lucide-react';
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from '../ui/input-group';

export const BoardComponent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { globalFilter, setGlobalFilter } = useTableStore();

  const { paginatedData, isLoading, totalPages } = useGetStockUS(
    currentPage,
    20
  );

  const deboGlobalFilter = useDebounce(globalFilter, 200);
  const searchQuery =
    deboGlobalFilter.trim() !== '' ? deboGlobalFilter.trim() : null;

  const { searchData, isSearchLoading } = useSearchStockUS(searchQuery);

  useEffect(() => {
    if (searchQuery) {
      setCurrentPage(1);
    }
  }, [searchQuery, searchData]);

  const handleGetDetailStock = (data: any) => {
    console.log('Get Detail Stock: ', data);
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
            value={globalFilter || ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
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
          isLoading={isLoading || isSearchLoading}
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
    </div>
  );
};

export default BoardComponent;
