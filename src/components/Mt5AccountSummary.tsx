import React, { useEffect, useState } from 'react';

type Mt5AccountInfo = {
  success: boolean
  balance?: number
  equity?: number
  margin?: number
  free_margin?: number
  margin_level?: number
  leverage?: number
  name?: string
  login?: number
  currency?: string
  error?: string
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

async function fetchMt5AccountInfo(
  { account, password, server }: { account: string, password: string, server: string },
  token: string
): Promise<Mt5AccountInfo> {
  const res = await fetch('http://localhost:3001/api/mt5/account', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ account, password, server })
  });
  return await res.json();
}

const Mt5AccountSummary: React.FC<{ account: string, password: string, server: string }> = ({
  account, password, server
}) => {
  const [info, setInfo] = useState<Mt5AccountInfo | null>(null);

  useEffect(() => {
    async function fetchInfo() {
      const token = getAccessToken();
      if (!token) return;
      const data = await fetchMt5AccountInfo({ account, password, server }, token);
      if (data && data.success) setInfo(data);
    }
    fetchInfo();
  }, [account, password, server]);

  if (!info) return <div className="text-gray-400">Loading...</div>;

  return (
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <div className="text-gray-400">Balance</div>
        <div className="text-xl font-bold">{info.balance} {info.currency}</div>
      </div>
      <div>
        <div className="text-gray-400">Equity</div>
        <div className="text-xl font-bold">{info.equity} {info.currency}</div>
      </div>
      <div>
        <div className="text-gray-400">Free Margin</div>
        <div className="text-lg">{info.free_margin}</div>
      </div>
      <div>
        <div className="text-gray-400">Margin</div>
        <div className="text-lg">{info.margin}</div>
      </div>
      <div>
        <div className="text-gray-400">Margin Level</div>
        <div className="text-lg">{info.margin_level}</div>
      </div>
      <div>
        <div className="text-gray-400">Leverage</div>
        <div className="text-lg">{info.leverage}x</div>
      </div>
    </div>
  );
};

export default Mt5AccountSummary;
