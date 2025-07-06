import React, { useState, useEffect } from 'react';

type MT5ConnectionPanelProps = {
  account: string;
  password: string;
  server: string;
  setAccount: (val: string) => void;
  setPassword: (val: string) => void;
  setServer: (val: string) => void;
  onSuccess: () => void;
};

const getAccessToken = () => {
  const key = Object.keys(localStorage).find(k => k.endsWith('-auth-token'));
  if (!key) return null;
  try {
    return JSON.parse(localStorage.getItem(key) || '{}').access_token;
  } catch {
    return null;
  }
};

const MT5ConnectionPanel: React.FC<MT5ConnectionPanelProps> = ({
  account, password, server, setAccount, setPassword, setServer, onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load saved server on mount
  useEffect(() => {
    const savedServer = localStorage.getItem('mt5Server');
    if (savedServer && !server) {
      setServer(savedServer);
    }
    // eslint-disable-next-line
  }, [setServer, server]);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No access token!');
      const res = await fetch('http://localhost:3001/api/mt5/connect', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ account, password, server }),
      });
      const data = await res.json();
      if (data && data.success) {
        // Save server to localStorage on successful connect
        localStorage.setItem('mt5Server', server);
        onSuccess();
      } else {
        setError(data.error || 'Connection failed');
      }
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    }
    setLoading(false);
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">MT5 Connect</h3>
      <form className="flex flex-col gap-3" onSubmit={handleConnect} autoComplete="off">
        {/* Hidden dummy field to block browser autofill */}
        <input style={{ display: 'none' }} type="text" autoComplete="off" />
        <input
          className="bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
          type="text"
          placeholder="Account Number"
          value={account}
          onChange={e => setAccount(e.target.value)}
          required
          name="mt5-account-number"
          autoComplete="off"
        />
        <input
          className="bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          name="mt5-password"
          autoComplete="new-password"
        />
        <input
          className="bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
          type="text"
          placeholder="Server (e.g. OneRoyal-Server)"
          value={server}
          onChange={e => setServer(e.target.value)}
          required
          name="mt5-server"
          autoComplete="off"
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition-colors"
          type="submit"
          disabled={loading || !account || !server || !password}
        >
          {loading ? 'Connecting...' : 'Connect'}
        </button>
        {error && <div className="text-red-400 mt-2">{error}</div>}
      </form>
    </div>
  );
};

export default MT5ConnectionPanel;
