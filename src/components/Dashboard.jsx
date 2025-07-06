import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import MT5Service from '../services/mt5Service';
import AccountInfo from './AccountInfo';
import TradingChart from './TradingChart';
import PositionsList from './PositionsList';
import MT5ConnectionModal from './MT5ConnectionModal';

const Dashboard = () => {
  const { user, mt5Credentials, isMT5Connected } = useAuth();
  const [accountData, setAccountData] = useState(null);
  const [positions, setPositions] = useState([]);
  const [marketData, setMarketData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConnectionModal, setShowConnectionModal] = useState(false);

  // Load MT5 data when credentials are available
  useEffect(() => {
    if (isMT5Connected && mt5Credentials) {
      loadMT5Data();
    }
  }, [isMT5Connected, mt5Credentials]);

  const loadMT5Data = async () => {
    if (!mt5Credentials) return;
    
    setIsLoading(true);
    setError('');

    try {
      // Connect to MT5 with stored credentials
      await MT5Service.connect(
        mt5Credentials.server,
        mt5Credentials.login,
        mt5Credentials.password
      );

      // Load all required data
      const [accountInfo, positionsData, chartData] = await Promise.all([
        MT5Service.getAccountInfo(),
        MT5Service.getPositions(),
        MT5Service.getMarketData('EURUSD', 'H1', 50)
      ]);

      if (accountInfo.success) {
        setAccountData(accountInfo.data);
      }

      if (positionsData.success) {
        setPositions(positionsData.data);
      }

      if (chartData.success) {
        setMarketData(chartData.data);
      }

    } catch (err) {
      console.error('Error loading MT5 data:', err);
      setError('Failed to load MT5 data. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectMT5 = () => {
    setShowConnectionModal(true);
  };

  const handleConnectionSuccess = () => {
    setShowConnectionModal(false);
    loadMT5Data();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading MT5 data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name || user?.email}
          </h1>
          <p className="text-gray-600 mt-2">
            Monitor your MT5 trading account and performance
          </p>
        </div>

        {/* MT5 Connection Status */}
        {!isMT5Connected ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-yellow-800">
                  Connect Your MT5 Account
                </h3>
                <p className="text-yellow-700 mt-1">
                  Connect your MetaTrader 5 account to view real-time data and trading history.
                </p>
              </div>
              <button
                onClick={handleConnectMT5}
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Connect MT5
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <p className="text-green-800">
                Connected to MT5 Account: {mt5Credentials?.login} ({mt5Credentials?.server})
              </p>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-800">{error}</p>
            <button
              onClick={loadMT5Data}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Dashboard Content */}
        {isMT5Connected && (
          <div className="space-y-8">
            {/* Account Information */}
            {accountData && <AccountInfo data={accountData} />}

            {/* Trading Chart */}
            {marketData.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  EURUSD Chart
                </h2>
                <TradingChart data={marketData} />
              </div>
            )}

            {/* Current Positions */}
            {positions.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Open Positions
                </h2>
                <PositionsList positions={positions} />
              </div>
            )}

            {/* No Data Message */}
            {isMT5Connected && !accountData && !isLoading && (
              <div className="text-center py-12">
                <p className="text-gray-500">No data available. Please check your MT5 connection.</p>
                <button
                  onClick={loadMT5Data}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Refresh Data
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MT5 Connection Modal */}
      {showConnectionModal && (
        <MT5ConnectionModal
          onClose={() => setShowConnectionModal(false)}
          onSuccess={handleConnectionSuccess}
        />
      )}
    </div>
  );
};

export default Dashboard;