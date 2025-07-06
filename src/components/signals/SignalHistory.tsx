import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import SignalCard from '../SignalCard'
import { Search, Filter, Download, Calendar } from 'lucide-react'

interface TradingSignal {
  id: string
  symbol: string
  signal_type: 'BUY' | 'SELL'
  entry_price: number
  stop_loss: number
  take_profit: number
  confidence: number
  market_analysis: string | null
  status: 'ACTIVE' | 'CLOSED' | 'CANCELLED'
  created_at: string
  profit_loss: number
}

export const SignalHistory: React.FC = () => {
  const { user } = useAuth()
  const [signals, setSignals] = useState<TradingSignal[]>([])
  const [filteredSignals, setFilteredSignals] = useState<TradingSignal[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [symbolFilter, setSymbolFilter] = useState('ALL')

  useEffect(() => {
    if (user) {
      fetchSignals()
    }
  }, [user])

  useEffect(() => {
    filterSignals()
  }, [signals, searchTerm, statusFilter, symbolFilter])

  const fetchSignals = async () => {
    try {
      const { data, error } = await supabase
        .from('trading_signals')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setSignals(data)
    } catch (error) {
      console.error('Error fetching signals:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterSignals = () => {
    let filtered = signals

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(signal =>
        signal.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (signal.market_analysis && signal.market_analysis.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(signal => signal.status === statusFilter)
    }

    // Symbol filter
    if (symbolFilter !== 'ALL') {
      filtered = filtered.filter(signal => signal.symbol === symbolFilter)
    }

    setFilteredSignals(filtered)
  }

  const uniqueSymbols = [...new Set(signals.map(s => s.symbol))]

  const stats = {
    total: signals.length,
    active: signals.filter(s => s.status === 'ACTIVE').length,
    closed: signals.filter(s => s.status === 'CLOSED').length,
    totalPnL: signals.reduce((sum, s) => sum + s.profit_loss, 0),
    winRate: signals.filter(s => s.status === 'CLOSED').length > 0 
      ? (signals.filter(s => s.status === 'CLOSED' && s.profit_loss > 0).length / signals.filter(s => s.status === 'CLOSED').length) * 100 
      : 0
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Signal History</h1>
          <p className="text-gray-400">Track your AI-generated trading signals and performance</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-400">{stats.total}</div>
            <div className="text-sm text-gray-400">Total Signals</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400">{stats.active}</div>
            <div className="text-sm text-gray-400">Active</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-400">{stats.closed}</div>
            <div className="text-sm text-gray-400">Closed</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4">
            <div className={`text-2xl font-bold ${stats.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ${stats.totalPnL.toFixed(2)}
            </div>
            <div className="text-sm text-gray-400">Total P&L</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-400">{stats.winRate.toFixed(1)}%</div>
            <div className="text-sm text-gray-400">Win Rate</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-800 rounded-lg p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search signals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="CLOSED">Closed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>

              {/* Symbol Filter */}
              <select
                value={symbolFilter}
                onChange={(e) => setSymbolFilter(e.target.value)}
                className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Symbols</option>
                {uniqueSymbols.map(symbol => (
                  <option key={symbol} value={symbol}>{symbol}</option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Signals List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSignals.map((signal) => (
            <SignalCard key={signal.id} signal={signal} />
          ))}
        </div>

        {filteredSignals.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No signals found</h3>
              <p>Try adjusting your filters or create your first signal.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SignalHistory
