import { TradingSignal, MarketData, ChartData, PortfolioStats, TimeframeType } from '../types/trading';

const symbols = ['XAUUSD', 'EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD', 'NZDUSD', 'USDCHF'];
const timeframes: TimeframeType[] = ['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w'];

export const generateMockSignal = (): TradingSignal => {
  const symbol = symbols[Math.floor(Math.random() * symbols.length)];
  const action = Math.random() > 0.5 ? 'BUY' : 'SELL';
  const confidence = Math.floor(Math.random() * 30) + 70; // 70-100%
  const price = getBasePriceForSymbol(symbol) + (Math.random() - 0.5) * getBasePriceForSymbol(symbol) * 0.02;
  const targetPrice = action === 'BUY' ? price * 1.02 : price * 0.98;
  const stopLoss = action === 'BUY' ? price * 0.99 : price * 1.01;
  const potentialReturn = Math.abs((targetPrice - price) / price) * 100;
  
  const reasons = [
    'Strong bullish momentum detected with RSI oversold conditions and volume spike',
    'Technical analysis shows breakout above key resistance level with MACD confirmation',
    'Moving average convergence suggests upward trend continuation with institutional flow',
    'Volume spike indicates smart money accumulation at support levels',
    'Support level holding with bullish divergence on multiple timeframes',
    'Fibonacci retracement shows potential bounce from 618 level with confluence',
    'Price action forming ascending triangle pattern with decreasing volume',
    'Bollinger Bands squeeze indicating potential volatility expansion',
    'Hammer candlestick pattern at key support with high volume confirmation',
    'Double bottom formation completed with neckline breakout'
  ];

  return {
    id: `signal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    symbol,
    action,
    confidence,
    price: parseFloat(price.toFixed(getDecimalPlaces(symbol))),
    targetPrice: parseFloat(targetPrice.toFixed(getDecimalPlaces(symbol))),
    stopLoss: parseFloat(stopLoss.toFixed(getDecimalPlaces(symbol))),
    timestamp: new Date(),
    reasoning: reasons[Math.floor(Math.random() * reasons.length)],
    timeframe: timeframes[Math.floor(Math.random() * timeframes.length)],
    riskLevel: confidence > 85 ? 'LOW' : confidence > 75 ? 'MEDIUM' : 'HIGH',
    potentialReturn: parseFloat(potentialReturn.toFixed(2))
  };
};

export const generateMockMarketData = (): MarketData => {
  const symbol = 'XAUUSD';
  const basePrice = 2008.66;
  const change = (Math.random() - 0.5) * 40;
  const changePercent = (change / basePrice) * 100;
  
  return {
    symbol,
    price: parseFloat((basePrice + change).toFixed(2)),
    change: parseFloat(change.toFixed(2)),
    changePercent: parseFloat(changePercent.toFixed(2)),
    volume: Math.floor(Math.random() * 1000000) + 500000,
    high24h: basePrice + Math.random() * 20,
    low24h: basePrice - Math.random() * 20,
    timestamp: new Date()
  };
};

export const generateChartData = (points: number = 50, timeframe: TimeframeType = '1h'): ChartData[] => {
  const data: ChartData[] = [];
  let basePrice = 2008.66;
  const now = new Date();
  const intervalMs = getIntervalMs(timeframe);
  
  for (let i = points - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - (i * intervalMs));
    const volatility = getVolatilityForTimeframe(timeframe);
    
    const open = basePrice;
    const change = (Math.random() - 0.5) * basePrice * volatility;
    const high = open + Math.abs(change) + (Math.random() * basePrice * volatility * 0.5);
    const low = open - Math.abs(change) - (Math.random() * basePrice * volatility * 0.5);
    const close = open + change;
    
    data.push({
      time: time.toISOString(),
      price: close,
      volume: Math.floor(Math.random() * 10000) + 5000,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2))
    });
    
    basePrice = close;
  }
  
  return data;
};

export const generatePortfolioStats = (): PortfolioStats => {
  return {
    totalValue: 50000,
    totalPnL: 2500.50,
    winRate: 78.5,
    totalTrades: 45,
    activeSignals: 3
  };
};

function getBasePriceForSymbol(symbol: string): number {
  const prices: Record<string, number> = {
    'XAUUSD': 2008.66,
    'EURUSD': 1.0856,
    'GBPUSD': 1.2734,
    'USDJPY': 149.85,
    'AUDUSD': 0.6598,
    'USDCAD': 1.3542,
    'NZDUSD': 0.6123,
    'USDCHF': 0.8756
  };
  return prices[symbol] || 1.0000;
}

function getDecimalPlaces(symbol: string): number {
  if (symbol.includes('JPY')) return 3;
  if (symbol === 'XAUUSD') return 2;
  return 5;
}

function getIntervalMs(timeframe: TimeframeType): number {
  const mapping: Record<TimeframeType, number> = {
    '1m': 60 * 1000,
    '5m': 5 * 60 * 1000,
    '15m': 15 * 60 * 1000,
    '30m': 30 * 60 * 1000,
    '1h': 60 * 60 * 1000,
    '4h': 4 * 60 * 60 * 1000,
    '1d': 24 * 60 * 60 * 1000,
    '1w': 7 * 24 * 60 * 60 * 1000
  };
  return mapping[timeframe];
}

function getVolatilityForTimeframe(timeframe: TimeframeType): number {
  const mapping: Record<TimeframeType, number> = {
    '1m': 0.0005,  // 0.05%
    '5m': 0.001,   // 0.1%
    '15m': 0.002,  // 0.2%
    '30m': 0.003,  // 0.3%
    '1h': 0.005,   // 0.5%
    '4h': 0.01,    // 1%
    '1d': 0.02,    // 2%
    '1w': 0.05     // 5%
  };
  return mapping[timeframe];
}