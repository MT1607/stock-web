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

const useSearchStockUS = (query: string | null) => {
  const swrKey = query ? [`search`, { q: query, exchange: 'US' }] : null;

  const { data, error, isLoading } = useSWR<SearchStock, any, any>(
    swrKey,
    async (key: [`search`, { q: string; exchange: string }]) => {
      const [url, params] = key;
      return fetchData(url, params);
    }
  );

  return {
    searchData: data ? data : null,
    isSearchLoading: isLoading,
    isSearchError: !!error,
  };
};
export { useGetStockUS, useSearchStockUS };
