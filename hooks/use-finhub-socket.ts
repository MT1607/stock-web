import { useCallback, useEffect, useRef, useState } from 'react';

export const useFinnhubSocket = (symbol: string) => {
  const SOCKET_FINNHUB_KEY = 'd3qo5s1r01quv7kbohkgd3qo5s1r01quv7kbohl0';
  const SOCKET_FINNHUB_URL = 'wss://ws.finnhub.io';
  const socketUrl = `${SOCKET_FINNHUB_URL}?token=${SOCKET_FINNHUB_KEY}`;

  console.log('socket url: ', socketUrl);

  const [trades, setTrades] = useState<any>([]);
  const [isConnect, setIsConnect] = useState(false);
  const ws = useRef<WebSocket>(null);
  const currentSymbolRef = useRef<string>(null);
  const MAX_TRADES = 20;

  //function to subscribe
  const sendCommand = useCallback((type: string, s: string) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: type, symbol: s }));
      console.log(
        `${type === 'subscribe' ? 'Subscribe' : 'Unsubscribe'} to : ${s}`
      );
    }
  }, []);

  // set-up websocket
  useEffect(() => {
    ws.current = new WebSocket(socketUrl);

    ws.current.onopen = () => {
      setIsConnect(true);
      console.log('Websocket connected');

      if (symbol) {
        sendCommand('subscribe', symbol);
        currentSymbolRef.current = symbol;
      }
    };

    ws.current.onmessage = (event) => {
      console.log('message socket: ', event);
      const res = JSON.parse(event.data);
      if (res.type === 'trade' && res.data) {
        console.log('res websocket: ', res);
        setTrades((prevTrades: any) => {
          const newTrades = res.data.map((trade: any) => ({
            ...trade,
            timestamp: new Date(trade.t).toLocaleTimeString(), // Định dạng thời gian
            id: `${trade.t}-${Math.random()}`, // Key duy nhất
          }));

          console.log('trades: ', trades);
          return [...newTrades, ...prevTrades].slice(0, MAX_TRADES);
        });
      }
    };

    ws.current.onclose = () => {
      setIsConnect(false);
      console.log('WebSocket Disconnected');
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    return () => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        // Hủy đăng ký mã cuối cùng trước khi đóng
        if (currentSymbolRef.current) {
          sendCommand('unsubscribe', currentSymbolRef.current);
        }
        ws.current.close();
      }
    };
  }, [sendCommand]);

  useEffect(() => {
    if (!isConnect) return;
    const previousSymbols = currentSymbolRef.current;

    if (previousSymbols && previousSymbols !== symbol) {
      sendCommand('unsubscribe', previousSymbols);
    }

    if (symbol) {
      setTrades([]);
      sendCommand('subscribe', symbol);
      currentSymbolRef.current = symbol;
    }
  }, [symbol, isConnect, sendCommand]);

  return { trades, isConnect, currentSymbol: currentSymbolRef.current };
};
