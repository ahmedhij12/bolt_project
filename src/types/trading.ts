export interface TradingSignal {
  id: string;
  symbol: string;
  action: 'BUY' | 'SELL';
  confidence: number;
  price: number;
  targetPrice: number;
  stopLoss: number;
  timestamp: Date;
  reasoning: string;
  timeframe: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  potentialReturn: number;
}

export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high24h: number;
  low24h: number;
  timestamp: Date;
}

export interface ChartData {
  time: string;
  price: number;
  volume: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface PortfolioStats {
  totalValue: number;
  totalPnL: number;
  winRate: number;
  totalTrades: number;
  activeSignals: number;
}

export interface RealTimePrice {
  symbol: string;
  bid: number;
  ask: number;
  timestamp: number;
}

export interface CandlestickData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type TimeframeType = '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1d' | '1w';

export interface DataProvider {
  name: string;
  isConnected: boolean;
  lastUpdate: Date | null;
  error: string | null;
}