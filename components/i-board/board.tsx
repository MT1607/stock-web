'use client';

import { useGetStockUS } from '@/hooks/use-finhub';
import { useEffect } from 'react';

export const BoardComponent = () => {
  const { data, isLoading, isError } = useGetStockUS();
  useEffect(() => {
    console.log('Board Component Mounted: ', data);
  }, [data, isLoading]);
  return (
    <div>
      {data ? (
        <>
          {data.map((stock) => {
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
    </div>
  );
};

export default BoardComponent;
