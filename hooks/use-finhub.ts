'use client';
import { fetchData } from '@/lib/feth-utils';
import { QuoteStock, ResListStocks, SearchStock, Stock } from '@/types';
import { ftruncate } from 'fs';
import useSWR, { SWRConfiguration } from 'swr';

const useGetStockUS = (page = 1, limit = 20, options?: SWRConfiguration) => {
  const { data, error, isLoading } = useSWR<ResListStocks>(
    [`/stock`, { exchange: 'US', page, limit }],
    ([url, params]) => fetchData(url, params),
    options
  );
  return {
    paginatedData: data ? data.dataJson : ([] as Stock[]),
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

const useQuoteStockUS = (symbol: string | null) => {
  const swrKey = symbol ? ['quote', { symbol: symbol }] : null;

  const { data, error, isLoading } = useSWR<QuoteStock, any, any>(
    swrKey,
    async (key: ['quote', { symbol: string }]) => {
      const [url, params] = key;
      return fetchData(url, params);
    }
  );

  return {
    quoteData: data,
  };
};
export { useGetStockUS, useSearchStockUS, useQuoteStockUS };
