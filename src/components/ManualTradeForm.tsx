import React, { useState } from 'react';

const ManualTradeForm: React.FC<{
  symbols: string[];
  onTrade: (params: {
    symbol: string;
    type: 'BUY' | 'SELL';
    volume: number;
    sl?: number;
    tp?: number;
  }) => Promise<void>;
}> = ({ symbols, onTrade }) => {
  const [symbol, setSymbol] = useState(symbols[0]);
  const [type, setType] = useState<'BUY' | 'SELL'>('BUY');
  const [volume, setVolume] = useState(0.01);
  const [sl, setSL] = useState('');
  const [tp, setTP] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await onTrade({
        symbol,
        type,
        volume,
        sl: sl ? parseFloat(sl) : undefined,
        tp: tp ? parseFloat(tp) : undefined,
      });
      setMessage('Trade sent successfully!');
    } catch (err) {
      setMessage('Failed to send trade.');
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-800 rounded-lg border border-slate-700 p-6 mb-8"
    >
      <h2 className="text-xl font-semibold mb-4">Manual Trade Input</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-400 mb-1">Symbol</label>
          <select
            value={symbol}
            onChange={e => setSymbol(e.target.value)}
            className="w-full bg-slate-700 text-white border border-slate-600 rounded px-3 py-2"
          >
            {symbols.map(sym => (
              <option key={sym} value={sym}>
                {sym}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-400 mb-1">Type</label>
          <select
            value={type}
            onChange={e => setType(e.target.value as 'BUY' | 'SELL')}
            className="w-full bg-slate-700 text-white border border-slate-600 rounded px-3 py-2"
          >
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-400 mb-1">Lot Size</label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={volume}
            onChange={e => setVolume(Number(e.target.value))}
            className="w-full bg-slate-700 text-white border border-slate-600 rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-1">Stop Loss</label>
          <input
            type="number"
            value={sl}
            onChange={e => setSL(e.target.value)}
            className="w-full bg-slate-700 text-white border border-slate-600 rounded px-3 py-2"
            placeholder="Optional"
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-1">Take Profit</label>
          <input
            type="number"
            value={tp}
            onChange={e => setTP(e.target.value)}
            className="w-full bg-slate-700 text-white border border-slate-600 rounded px-3 py-2"
            placeholder="Optional"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-semibold"
      >
        {loading ? 'Sending...' : 'Send Trade'}
      </button>
      {message && (
        <div className="mt-3 text-sm text-center text-green-400">{message}</div>
      )}
    </form>
  );
};

export default ManualTradeForm;
