// hooks/useStockSocket.ts
import { useState, useEffect, useCallback } from 'react';

// Định nghĩa kiểu dữ liệu nến (Aggregate Per Minute)
interface CandlestickData {
  ev: string; // Loại sự kiện (ví dụ: 'AM')
  sym: string; // Mã cổ phiếu (ví dụ: 'AAPL')
  o: number; // Open
  h: number; // High
  l: number; // Low
  c: number; // Close
  v: number; // Volume
  s: number; // Start time (timestamp)
}

const NESTJS_WS_URL = 'ws://localhost:4040';

export const useMassiveSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  // Lưu trữ dữ liệu nến mới nhất
  const [latestCandle, setLatestCandle] = useState<CandlestickData | null>(
    null
  );
  const [socketError, setSocketError] = useState<string | null>(null);

  // 1. Thiết lập Kết nối
  useEffect(() => {
    const ws = new WebSocket(NESTJS_WS_URL);

    ws.onopen = () => {
      console.log('Connected to NestJS Gateway.');
      setIsConnected(true);
      setSocketError(null);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log('event  massive: ', event);

        // Giả định NestJS Gateway gửi dữ liệu nến trực tiếp
        if (message.ev && message.sym) {
          setLatestCandle(message as CandlestickData);
        }
        console.log('massive data: ', message);
      } catch (error) {
        console.error('Error parsing message from NestJS:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
      setSocketError('Lỗi kết nối WebSocket.');
    };

    ws.onclose = () => {
      console.log('Disconnected from NestJS Gateway.');
      setIsConnected(false);
      // Có thể thêm logic tự động kết nối lại ở đây
    };

    setSocket(ws);

    // Cleanup function khi component unmount
    return () => {
      ws.close();
    };
  }, []); // Chỉ chạy một lần khi component mount

  // 2. Hàm Gửi Yêu cầu Đăng ký Mã Cổ phiếu
  const subscribeToSymbol = useCallback(
    (symbol: string) => {
      if (socket && isConnected) {
        console.log(`Sending subscription request for: ${symbol}`);
        // Gửi tin nhắn đến NestJS Gateway với loại tin nhắn 'subscribeStock'
        socket.send(
          JSON.stringify({
            event: 'subscribeStock', // Phải khớp với @SubscribeMessage('subscribeStock') trong NestJS Gateway
            data: symbol.toUpperCase(),
          })
        );
      } else {
        console.warn('Socket not connected. Cannot subscribe.');
      }
    },
    [socket, isConnected]
  );

  // 3. Giá trị trả về của Hook
  return {
    isConnected,
    latestCandle,
    socketError,
    subscribeToSymbol,
  };
};
