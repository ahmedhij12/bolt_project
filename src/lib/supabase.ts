import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          mt5_account: string | null
          mt5_server: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          mt5_account?: string | null
          mt5_server?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          mt5_account?: string | null
          mt5_server?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      trading_signals: {
        Row: {
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
        Insert: {
          id?: string
          user_id: string
          symbol: string
          signal_type: 'BUY' | 'SELL'
          entry_price: number
          stop_loss: number
          take_profit: number
          confidence: number
          market_analysis?: string | null
          status?: 'ACTIVE' | 'CLOSED' | 'CANCELLED'
          created_at?: string
          closed_at?: string | null
          profit_loss?: number
        }
        Update: {
          id?: string
          user_id?: string
          symbol?: string
          signal_type?: 'BUY' | 'SELL'
          entry_price?: number
          stop_loss?: number
          take_profit?: number
          confidence?: number
          market_analysis?: string | null
          status?: 'ACTIVE' | 'CLOSED' | 'CANCELLED'
          created_at?: string
          closed_at?: string | null
          profit_loss?: number
        }
      }
      mt5_data: {
        Row: {
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
        Insert: {
          id?: string
          symbol: string
          timestamp: string
          open: number
          high: number
          low: number
          close: number
          volume: number
          created_at?: string
        }
        Update: {
          id?: string
          symbol?: string
          timestamp?: string
          open?: number
          high?: number
          low?: number
          close?: number
          volume?: number
          created_at?: string
        }
      }
      api_keys: {
        Row: {
          id: string
          user_id: string
          openai_key: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          openai_key: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          openai_key?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}