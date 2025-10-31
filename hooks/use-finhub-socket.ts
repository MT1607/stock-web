import { useCallback, useEffect, useRef, useState } from 'react';

export const useFinnhubSocket = (symbol: string) => {
  const socketUrl = 'ws://localhost:8080';

  const [trades, setTrades] = useState<any>([]);
  const [isConnect, setIsConnect] = useState(false);
  const ws = useRef<WebSocket>(null);
  const currentSymbolRef = useRef<string>(null);
  const MAX_TRADES = 20;

  //function to subscribe
  const sendCommand = useCallback(
    (type: 'subscribe' | 'unsubscribe', s: string) => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({ event: type, data: { symbol: s } }));
        console.log(
          `${type === 'subscribe' ? 'Subscribe' : 'Unsubscribe'} to : ${s}`
        );
      }
    },
    []
  );

  // set-up websocket
  useEffect(() => {
    if (!symbol) return;
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
            timestamp: new Date(trade.t).toLocaleTimeString(),
            id: `${trade.t}-${Math.random()}`,
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
        if (currentSymbolRef.current) {
          sendCommand('unsubscribe', currentSymbolRef.current);
        }
        ws.current.close();
      }
    };
  }, [symbol, sendCommand]);

  return { trades, isConnect, currentSymbol: currentSymbolRef.current };
};
