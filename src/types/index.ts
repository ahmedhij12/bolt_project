export interface TradingSignal {
  id: string
  user_id: string
  symbol: string
  signal_type: 'BUY' | 'SELL'
  entry_price: number
  stop_loss: number
  take_profit: number
  confidence: number
  market_analysis: string | null
  status: 'ACTIVE' | 'CLOSED' | 'CANCELLED'
  created_at: string
  closed_at: string | null
  profit_loss: number
}

export interface MT5Data {
  id: string
  symbol: string
  timestamp: string
  open: number
  high: number
  low: number
  close: number
  volume: number
  created_at: string
}

export interface Profile {
  id: string
  email: string
  full_name: string | null
  mt5_account: string | null
  mt5_server: string | null
  created_at: string
  updated_at: string
}

export interface APIKey {
  id: string
  user_id: string
  openai_key: string
  created_at: string
  updated_at: string
}