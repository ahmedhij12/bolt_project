import React from 'react';
import TradeHistory from './TradeHistory';

const TradeHistoryPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="flex justify-start mb-6">
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded text-white shadow"
        >
          Back to Dashboard
        </button>
      </div>
      <h1 className="text-3xl font-bold mb-6">Trade History</h1>
      <div className="bg-slate-800 rounded-lg p-4 shadow-inner">
        <TradeHistory />
      </div>
    </div>
  );
};

export default TradeHistoryPage;
