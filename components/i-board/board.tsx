'use client';

import { useGetStockUS } from '@/hooks/use-finhub';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { DataTable } from '../data-table';
import { columns } from './column-stock';

export const BoardComponent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { paginatedData, isLoading, isError } = useGetStockUS(currentPage, 20);

  useEffect(() => {
    console.log('Board Component Mounted: ', paginatedData);
  }, [paginatedData, isLoading]);

  const handleGetDetailStock = (data: any) => {
    console.log('Get Detail Stock: ', data);
  };

  return (
    <div>
      {paginatedData ? (
        <>
          {/* {paginatedData.map((stock) => {
            return (
              <div key={stock.symbol} className="border-b p-2">
                {stock.description} ({stock.symbol})
              </div>
            );
          })} */}
          <DataTable
            columns={columns}
            data={paginatedData}
            onRowDoubleClick={handleGetDetailStock}
          />
        </>
      ) : (
        <p>Loading stocks...</p>
      )}
      <div>
        <Button onClick={() => setCurrentPage(currentPage - 1)}>Prev</Button>
        {currentPage}
        <Button onClick={() => setCurrentPage(currentPage + 1)}>Next</Button>
      </div>
    </div>
  );
};

export default BoardComponent;
