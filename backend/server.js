const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

function verifyToken(req, res, next) {
  // Dummy implementation for development
  next();
}

const PYTHON_PATH = 'C:/Users/Lenovo/AppData/Local/Programs/Python/Python311/python.exe';
const PYTHON_SCRIPT_DIR = 'C:\\Users\\Lenovo\\Desktop\\project\\mt5_integration';

// Helper to get credentials from request or fallback to .env
function getMt5Credentials(req) {
  return {
    account: req.body.account || req.query.account || process.env.MT5_LOGIN,
    password: req.body.password || req.query.password || process.env.MT5_PASSWORD,
    server: req.body.server || req.query.server || process.env.MT5_SERVER,
  };
}

// --- Connect MT5
app.post('/api/mt5/connect', verifyToken, async (req, res) => {
  const { account, password, server } = getMt5Credentials(req);
  // Optionally, call Python here to verify connection
  res.json({ success: true, message: 'Connected to MT5 (stub).', account, server });
});

// --- Symbol Price (for chart candles, still stub unless you want real)
app.get('/api/mt5/price/:symbol', verifyToken, async (req, res) => {
  // This is a stub! If you want real chart candles, let me know.
  const symbol = req.params.symbol;
  res.json({ success: true, symbol, price: 2435.12 + Math.random() });
});

// --- OPEN Trades
app.get('/api/mt5/open-trades/:symbol', verifyToken, async (req, res) => {
  const symbol = req.params.symbol;
  const { account, password, server } = getMt5Credentials(req);

  const args = [
    'mt5_connector.py',
    '--account', account,
    '--password', password,
    '--server', server,
    '--type', 'open_trades',
    '--symbol', symbol,
  ];

  const py = spawn(PYTHON_PATH, args, { cwd: PYTHON_SCRIPT_DIR });
  let output = '';
  let errorOutput = '';
  py.stdout.on('data', (data) => { output += data; });
  py.stderr.on('data', (data) => { errorOutput += data; });
  py.on('close', () => {
    if (errorOutput) return res.status(500).json({ success: false, error: errorOutput });
    try {
      const json = JSON.parse(output);
      res.json({ success: true, trades: json });
    } catch {
      res.status(500).json({ success: false, error: 'Failed to parse MT5 open trades', details: output });
    }
  });
});

// --- TRADE HISTORY
app.get('/api/mt5/trade-history/:symbol', verifyToken, async (req, res) => {
  const symbol = req.params.symbol;
  const { account, password, server } = getMt5Credentials(req);

  const args = [
    'mt5_connector.py',
    '--account', account,
    '--password', password,
    '--server', server,
    '--type', 'trade_history'
  ];

  const py = spawn(PYTHON_PATH, args, { cwd: PYTHON_SCRIPT_DIR });
  let output = '';
  let errorOutput = '';
  py.stdout.on('data', (data) => { output += data; });
  py.stderr.on('data', (data) => { errorOutput += data; });
  py.on('close', () => {
    if (errorOutput) return res.status(500).json({ success: false, error: errorOutput });
    try {
      const json = JSON.parse(output);
      const filtered = symbol ? json.filter(t => t.symbol === symbol) : json;
      res.json({ success: true, trades: filtered });
    } catch {
      res.status(500).json({ success: false, error: 'Failed to parse MT5 trade history', details: output });
    }
  });
});

// --- MT5 Account Info
app.post('/api/mt5/account', verifyToken, async (req, res) => {
  const { account, password, server } = getMt5Credentials(req);

  const args = [
    'mt5_connector.py',
    '--account', account,
    '--password', password,
    '--server', server,
    '--type', 'account'
  ];

  const py = spawn(PYTHON_PATH, args, { cwd: PYTHON_SCRIPT_DIR });
  let output = '';
  let errorOutput = '';
  py.stdout.on('data', (data) => { output += data; });
  py.stderr.on('data', (data) => { errorOutput += data; });
  py.on('close', () => {
    if (errorOutput) return res.status(500).json({ success: false, error: errorOutput });
    try {
      const json = JSON.parse(output);
      res.json(json);
    } catch {
      res.status(500).json({ success: false, error: 'Failed to parse MT5 account info', details: output });
    }
  });
});

// --- Signals (stub)
app.get('/api/signals', verifyToken, async (req, res) => {
  res.json({ success: true, signals: [] });
});
app.post('/api/signals/generate', verifyToken, async (req, res) => {
  res.json({
    success: true,
    signal: {
      id: Date.now(),
      symbol: req.body.symbol || 'XAUUSD',
      type: 'BUY',
      status: 'ACTIVE',
      entry: 2435.12,
      sl: 2420,
      tp: 2450,
      time: new Date().toISOString()
    }
  });
});

// --- Manual Trade
app.post('/api/mt5/manual-trade', verifyToken, async (req, res) => {
  const { symbol, type, volume, sl, tp, account, password, server } = req.body;
  if (!symbol || !type || !volume) {
    return res.status(400).json({ success: false, error: 'Missing required params' });
  }
  const _account = account || process.env.MT5_LOGIN;
  const _password = password || process.env.MT5_PASSWORD;
  const _server = server || process.env.MT5_SERVER;
  const args = [
    'mt5_connector.py',
    '--account', _account,
    '--password', _password,
    '--server', _server,
    '--type', 'trade',
    '--symbol', symbol,
    '--trade_type', type,
    '--volume', volume.toString()
  ];
  if (sl) args.push('--sl', sl.toString());
  if (tp) args.push('--tp', tp.toString());
  const py = spawn(PYTHON_PATH, args, { cwd: PYTHON_SCRIPT_DIR });
  let output = '';
  let errorOutput = '';
  py.stdout.on('data', (data) => { output += data; });
  py.stderr.on('data', (data) => { errorOutput += data; });
  py.on('close', () => {
    if (errorOutput) return res.status(500).json({ success: false, error: errorOutput });
    try {
      const json = JSON.parse(output);
      res.json({ success: true, result: json });
    } catch {
      res.status(500).json({ success: false, error: 'Failed to parse MT5 trade response', details: output });
    }
  });
});

// --- 404 fallback
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'API endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
