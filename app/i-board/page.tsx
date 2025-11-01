import BoardComponent from '@/components/i-board/board';
import { fetchData } from '@/lib/feth-utils';
import { ResListStocks, Stock } from '@/types';
import { error } from 'console';

async function getInitStockData() {
  const result = await fetchData<ResListStocks>('/stock', { exchange: 'US' });

  if (!result) {
    throw new Error('Failed to fetch stock data');
  }

  return result;
}

const IboardPage = async () => {
  try {
    const initData = await getInitStockData();
    console.log('initData: ', initData);
    return (
      <div className="p-4">
        <h1 className="mb-4 text-2xl font-bold">I-Board</h1>
        <BoardComponent dataAllStocks={initData} />
      </div>
    );
  } catch {
    return <></>;
  }
};

export default IboardPage;
