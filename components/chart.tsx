import { useGetStatusMarket } from '@/hooks/use-finhub';
import { useMassiveSocket } from '@/hooks/use-massive-socket';
import { useState } from 'react';

const Chart = ({ symbol }: { symbol: string }) => {
  const { marketStatus, error, isLoading } = useGetStatusMarket();

  const { isConnected, latestCandle, socketError, subscribeToSymbol } =
    useMassiveSocket();
  const [symbolInput, setSymbolInput] = useState('AAPL');

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!marketStatus?.isOpen) {
    return <p>Market is close. Price is previous-price</p>;
  }

  return (
    <>
      {latestCandle && (
        <div style={{ border: '1px solid #ccc', padding: '15px' }}>
          <h3>⭐ {latestCandle.sym} - Dữ liệu Nến Mới</h3>
          <p>
            Mã: **{latestCandle.sym}** (Event: {latestCandle.ev})
          </p>
          <p>Giá Mở (Open): **${latestCandle.o.toFixed(2)}**</p>
          <p>Giá Đóng (Close): **${latestCandle.c.toFixed(2)}**</p>
          <p>
            Giá Cao (High): ${latestCandle.h.toFixed(2)} | Giá Thấp (Low): $
            {latestCandle.l.toFixed(2)}
          </p>
          <p>Khối lượng (Volume): {latestCandle.v.toLocaleString()}</p>
        </div>
      )}
    </>
  );
};

export default Chart;
