'use client';
import { fetchData } from '@/lib/feth-utils';
import { Stock } from '@/types';
import useSWR from 'swr';

const useGetStockUS = () => {
  const { data, error, isLoading } = useSWR(
    [`stock/symbol`, { exchange: 'US' }],
    ([url, params]) => fetchData<Stock[]>(url, params)
  );

  return {
    data,
    isLoading,
    isError: !!error,
  };
};

export { useGetStockUS };
