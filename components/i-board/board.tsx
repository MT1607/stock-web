'use client';

import { useGetStockUS } from '@/hooks/use-finhub';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';

export const BoardComponent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { paginatedData, isLoading, isError } = useGetStockUS(currentPage, 20);
  useEffect(() => {
    console.log('Board Component Mounted: ', paginatedData);
  }, [paginatedData, isLoading]);
  return (
    <div>
      {paginatedData ? (
        <>
          {paginatedData.map((stock) => {
            return (
              <div key={stock.symbol} className="border-b p-2">
                {stock.description} ({stock.symbol})
              </div>
            );
          })}
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
