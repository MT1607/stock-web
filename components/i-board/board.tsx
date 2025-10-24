'use client';

import { useGetStockUS } from '@/hooks/use-finhub';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { DataTable } from '../data-table';
import { columns } from './column-stock';
import { Input } from '../ui/input';
import { useTableStore } from '@/store/table-store';
import { Search, SearchIcon } from 'lucide-react';
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from '../ui/input-group';

export const BoardComponent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { paginatedData, isLoading, totalPages } = useGetStockUS(
    currentPage,
    20
  );
  const { globalFilter, setGlobalFilter } = useTableStore();

  useEffect(() => {
    console.log('isLoading: ', isLoading);
  }, [paginatedData, isLoading]);

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
      <>
        <InputGroup className="mb-3">
          <InputGroupInput
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search by symbol..."
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
        <DataTable
          columns={columns}
          data={paginatedData ? paginatedData : []}
          onRowDoubleClick={handleGetDetailStock}
          isLoadingData={isLoading}
        />
      </>

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
