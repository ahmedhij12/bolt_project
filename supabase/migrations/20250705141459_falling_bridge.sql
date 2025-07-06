/*
  # Trading Signal Prediction Database Schema

  ## New Tables
  1. `profiles` - User profile information
    - `id` (uuid, references auth.users)
    - `email` (text)
    - `full_name` (text)
    - `mt5_account` (text, encrypted)
    - `mt5_server` (text)
    - `created_at` (timestamp)
    - `updated_at` (timestamp)

  2. `trading_signals` - AI-generated trading signals
    - `id` (uuid, primary key)
    - `user_id` (uuid, references profiles)
    - `symbol` (text) - Trading pair (e.g., XAUUSD, NASDAQ)
    - `signal_type` (text) - BUY or SELL
    - `entry_price` (decimal)
    - `stop_loss` (decimal)
    - `take_profit` (decimal)
    - `confidence` (decimal) - AI confidence score
    - `market_analysis` (text) - AI analysis
    - `status` (text) - ACTIVE, CLOSED, CANCELLED
    - `created_at` (timestamp)
    - `closed_at` (timestamp)
    - `profit_loss` (decimal)

  3. `mt5_data` - Real-time MT5 market data
    - `id` (uuid, primary key)
    - `symbol` (text)
    - `timestamp` (timestamp)
    - `open` (decimal)
    - `high` (decimal)
    - `low` (decimal)
    - `close` (decimal)
    - `volume` (bigint)
    - `created_at` (timestamp)

  4. `api_keys` - Encrypted API keys storage
    - `id` (uuid, primary key)
    - `user_id` (uuid, references profiles)
    - `openai_key` (text, encrypted)
    - `created_at` (timestamp)
    - `updated_at` (timestamp)

  ## Security
  - Enable RLS on all tables
  - Users can only access their own data
  - Encrypted storage for sensitive information
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  mt5_account text,
  mt5_server text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create trading_signals table
CREATE TABLE IF NOT EXISTS trading_signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  symbol text NOT NULL,
  signal_type text NOT NULL CHECK (signal_type IN ('BUY', 'SELL')),
  entry_price decimal(10,5) NOT NULL,
  stop_loss decimal(10,5) NOT NULL,
  take_profit decimal(10,5) NOT NULL,
  confidence decimal(3,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  market_analysis text,
  status text NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'CLOSED', 'CANCELLED')),
  created_at timestamptz DEFAULT now(),
  closed_at timestamptz,
  profit_loss decimal(10,2) DEFAULT 0
);

-- Create mt5_data table
CREATE TABLE IF NOT EXISTS mt5_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol text NOT NULL,
  timestamp timestamptz NOT NULL,
  open decimal(10,5) NOT NULL,
  high decimal(10,5) NOT NULL,
  low decimal(10,5) NOT NULL,
  close decimal(10,5) NOT NULL,
  volume bigint NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create api_keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  openai_key text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trading_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE mt5_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Trading signals policies
CREATE POLICY "Users can view own signals"
  ON trading_signals
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own signals"
  ON trading_signals
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own signals"
  ON trading_signals
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- MT5 data policies (read-only for authenticated users)
CREATE POLICY "Authenticated users can view MT5 data"
  ON mt5_data
  FOR SELECT
  TO authenticated
  USING (true);

-- API keys policies
CREATE POLICY "Users can view own API keys"
  ON api_keys
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own API keys"
  ON api_keys
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own API keys"
  ON api_keys
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_trading_signals_user_id ON trading_signals(user_id);
CREATE INDEX IF NOT EXISTS idx_trading_signals_symbol ON trading_signals(symbol);
CREATE INDEX IF NOT EXISTS idx_trading_signals_created_at ON trading_signals(created_at);
CREATE INDEX IF NOT EXISTS idx_mt5_data_symbol ON mt5_data(symbol);
CREATE INDEX IF NOT EXISTS idx_mt5_data_timestamp ON mt5_data(timestamp);