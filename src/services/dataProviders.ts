// dataProviders.ts

/**
 * Functions to fetch real MT5 market data and current price
 * from your backend API.
 * Requires a valid JWT token from Supabase Auth.
 */

export async function getMT5MarketData(
  symbol: string,
  token: string,
  timeframe: string = 'H1',
  count: number = 100
) {
  const url = `/api/mt5/data/${symbol}?timeframe=${encodeURIComponent(timeframe)}&count=${count}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    let errMsg = 'Failed to fetch MT5 market data';
    try {
      const err = await res.json();
      if (err && err.error) errMsg = err.error;
    } catch { /* ignore */ }
    throw new Error(errMsg);
  }

  const result = await res.json();
  return result.data;
}

export async function getMT5CurrentPrice(
  symbol: string,
  token: string
) {
  const url = `/api/mt5/price/${symbol}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    let errMsg = 'Failed to fetch MT5 current price';
    try {
      const err = await res.json();
      if (err && err.error) errMsg = err.error;
    } catch { /* ignore */ }
    throw new Error(errMsg);
  }

  const result = await res.json();
  return result.data;
}

// USAGE EXAMPLE:
// import { getMT5MarketData, getMT5CurrentPrice } from './dataProviders';
// const token = ...get from Supabase Auth...
// const data = await getMT5MarketData('XAUUSD', token);
// const price = await getMT5CurrentPrice('XAUUSD', token);
