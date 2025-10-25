'use client';

import { useGetStockUS } from '@/hooks/use-finhub';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { DataTable } from '../data-table';
import { columns } from './column-stock';

export const BoardComponent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { paginatedData, isLoading, totalPages } = useGetStockUS(
    currentPage,
    20
  );

  useEffect(() => {
    console.log('Board Component Mounted: ', paginatedData);
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
        <DataTable
          columns={columns}
          data={paginatedData ? paginatedData : []}
          onRowDoubleClick={handleGetDetailStock}
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
