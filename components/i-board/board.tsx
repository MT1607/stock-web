'use client';

import { useGetStockUS, useSearchStockUS } from '@/hooks/use-finhub';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { DataTable } from '../data-table';
import { columns } from './column-stock';
import { useTableStore } from '@/store/table-store';
import { Input } from '../ui/input';

export const BoardComponent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { globalFilter, setGlobalFilter } = useTableStore();

  const { paginatedData, isLoading, totalPages } = useGetStockUS(
    currentPage,
    20
  );

  const { searchData, isSearchLoading } = useSearchStockUS(globalFilter);

  useEffect(() => {
    console.log('Search Data: ', searchData?.result);
    setCurrentPage(1);
  }, [globalFilter, searchData]);

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
        <Input
          placeholder="search"
          value={globalFilter || ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
        <DataTable
          columns={columns}
          data={searchData?.result || paginatedData}
          onRowDoubleClick={handleGetDetailStock}
          isLoading={isLoading || isSearchLoading}
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
