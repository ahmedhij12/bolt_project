import React from 'react'
import { TrendingUp, TrendingDown, Clock, Target, Shield } from 'lucide-react'
import { format } from 'date-fns'

interface SignalCardProps {
  signal: {
    id: string
    symbol: string
    signal_type: 'BUY' | 'SELL'
    entry_price: number | undefined | null
    stop_loss: number | undefined | null
    take_profit: number | undefined | null
    confidence: number | undefined | null
    market_analysis: string | null
    status: 'ACTIVE' | 'CLOSED' | 'CANCELLED'
    created_at: string | undefined | null
    profit_loss: number | undefined | null
  }
}

// Helper for safely formatting numbers
const safeFixed = (num: number | undefined | null) =>
  typeof num === 'number' && !isNaN(num) ? num.toFixed(2) : '--';

// Helper for safely formatting dates
const safeDate = (dateString: string | undefined | null) => {
  if (!dateString) return '--';
  const dateObj = new Date(dateString);
  return isNaN(dateObj.getTime()) ? '--' : format(dateObj, 'MMM dd, HH:mm');
};

const SignalCard: React.FC<SignalCardProps> = ({ signal }) => {
  const isBuy = signal.signal_type === 'BUY'
  const isProfit = typeof signal.profit_loss === 'number' && signal.profit_loss > 0

  return (
    <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {isBuy ? (
            <TrendingUp className="h-5 w-5 text-green-400" />
          ) : (
            <TrendingDown className="h-5 w-5 text-red-400" />
          )}
          <span className="font-semibold text-lg">{signal.symbol}</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            isBuy 
              ? 'bg-green-900 text-green-300' 
              : 'bg-red-900 text-red-300'
          }`}>
            {signal.signal_type}
          </span>
        </div>
        <div className="text-right">
          <div className={`text-sm font-medium ${
            signal.status === 'ACTIVE' ? 'text-blue-400' :
            signal.status === 'CLOSED' ? 'text-gray-400' :
            'text-orange-400'
          }`}>
            {signal.status}
          </div>
          {signal.status === 'CLOSED' && (
            <div className={`text-lg font-bold ${
              isProfit ? 'text-green-400' : 'text-red-400'
            }`}>
              {isProfit ? '+' : ''}${safeFixed(signal.profit_loss)}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="text-center">
          <div className="text-xs text-gray-400 mb-1">Entry</div>
          <div className="text-sm font-semibold">{safeFixed(signal.entry_price)}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-400 mb-1 flex items-center justify-center">
            <Shield className="h-3 w-3 mr-1" />
            SL
          </div>
          <div className="text-sm font-semibold text-red-400">{safeFixed(signal.stop_loss)}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-400 mb-1 flex items-center justify-center">
            <Target className="h-3 w-3 mr-1" />
            TP
          </div>
          <div className="text-sm font-semibold text-green-400">{safeFixed(signal.take_profit)}</div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-xs text-gray-400">
            {safeDate(signal.created_at)}
          </span>
        </div>
        <div className="text-xs text-gray-400">
          Confidence: {typeof signal.confidence === 'number' ? (signal.confidence * 100).toFixed(0) : '--'}%
        </div>
      </div>

      {signal.market_analysis && (
        <div className="mt-3 pt-3 border-t border-slate-600">
          <p className="text-xs text-gray-300 line-clamp-2">{signal.market_analysis}</p>
        </div>
      )}
    </div>
  )
}

export default SignalCard
