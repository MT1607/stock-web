export interface Stock {
  currency: string;
  description: string;
  displaySymbol: string;
  figi: string;
  mic: string;
  symbol: string;
  type: string;
  isin: string | null;
  shareClassFIGI: string;
  symbol2: string | '';
}

export interface SearchStock {
  count: number;
  result: Stock[];
}
