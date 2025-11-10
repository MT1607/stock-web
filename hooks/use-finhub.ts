'use client';
import { fetchData } from '@/lib/feth-utils';
import {
  MarketStatus,
  QuoteStock,
  ResListStocks,
  SearchStock,
  Stock,
} from '@/types';
import useSWR, { SWRConfiguration } from 'swr';
import useSWRInfinite from 'swr/infinite';

const getKey = (pageIndex: number, previousPageData: ResListStocks | null) => {
  if (previousPageData && previousPageData.dataJson.length === 0) return null; // reached the end
  return [`/stock`, { exchange: 'US', page: pageIndex + 1, limit: 20 }]; // SWR key
};

const useGetStockUS = (page = 1, limit = 20, options?: SWRConfiguration) => {
  const { data, error, isLoading, size, setSize } =
    useSWRInfinite<ResListStocks>(
      getKey,
      ([url, params]) => fetchData<ResListStocks>(url, params),
      options
    );

  return {
    paginatedData: data ? data.flatMap((p) => p.dataJson) : ([] as Stock[]),
    totalItems: data && data.length ? data[0].totalItems : 0,
    totalPages: data && data.length ? data[0].totalPages : 0,
    isLoading,
    isError: !!error,
    size,
    setSize,
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
    error,
    isLoading,
  };
};

const useGetStatusMarket = () => {
  const { data, error, isLoading } = useSWR<MarketStatus>(
    ['market-status', { exchange: 'US' }],
    ([url, params]) => fetchData<MarketStatus>(url, params)
  );
  return { marketStatus: data, error, isLoading };
};
export { useGetStockUS, useSearchStockUS, useQuoteStockUS, useGetStatusMarket };
