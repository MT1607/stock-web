import BoardComponent from '@/components/i-board/board';
import { fetchData } from '@/lib/feth-utils';
import { ResListStocks } from '@/types';

async function getInitStockData() {
  const result = await fetchData<ResListStocks>('/stock', { exchange: 'US' });

  if (!result) {
    throw new Error('Failed to fetch stock data');
  }

  return result;
}

const BoardWrapper = async () => {
  const initData = await getInitStockData();

  return <BoardComponent dataAllStocks={initData} />;
};

export default BoardWrapper;
