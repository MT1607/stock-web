'use client';
import { fetchData } from '@/lib/feth-utils';
import { SearchStock, Stock } from '@/types';
import useSWR from 'swr';

const useGetStockUS = (page = 1, limit = 20) => {
  const { data, error, isLoading } = useSWR<{
    data: Stock[];
    totalItems: number;
    totalPages: number;
  }>([`stock/symbol`, { exchange: 'US', page, limit }], ([url, params]) =>
    fetchData(url, params)
  );

  return {
    paginatedData: data ? data.data : ([] as Stock[]),
    totalItems: data ? data.totalItems : 0,
    totalPages: data ? data.totalPages : 0,
    isLoading,
    isError: !!error,
  };
};

const useSearchStockUS = (query: string) => {
  const { data, error, isLoading } = useSWR<SearchStock>(
    [`search`, { q: query, exchange: 'US' }],
    ([url, params]) => fetchData(url, params)
  );
  return {
    searchData: data ? data : null,
    isSearchLoading: isLoading,
    isSearchError: !!error,
  };
};
export { useGetStockUS, useSearchStockUS };
