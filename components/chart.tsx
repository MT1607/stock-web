import { useGetStatusMarket } from '@/hooks/use-finhub';

const Chart = ({ symbol }: { symbol: string }) => {
  const { marketStatus, error, isLoading } = useGetStatusMarket();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!marketStatus?.isOpen) {
    return <p>Market is close. Price is previous-price</p>;
  }

  return <p>Market is open</p>;
};

export default Chart;
