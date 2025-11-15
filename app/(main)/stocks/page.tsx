import StockFollow from '@/components/stocks/stock-follow';

const StocksPage = async () => {
  return (
    <div className="h-full w-full p-2">
      <h1 className="mb-4 text-2xl font-bold">Stocks</h1>
      <StockFollow />
    </div>
  );
};

export default StocksPage;
