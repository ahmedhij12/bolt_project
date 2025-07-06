import React, { useState } from 'react';
import { Settings, Wifi, WifiOff, Key, AlertCircle, CheckCircle } from 'lucide-react';
import { DataProvider } from '../types/trading';

interface DataProviderSettingsProps {
  providers: DataProvider[];
  onProviderUpdate: (providerName: string, apiKey: string) => void;
  onTestConnection: (providerName: string) => Promise<boolean>;
}

const DataProviderSettings: React.FC<DataProviderSettingsProps> = ({
  providers,
  onProviderUpdate,
  onTestConnection
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [testing, setTesting] = useState<Record<string, boolean>>({});

  const handleTestConnection = async (providerName: string) => {
    setTesting(prev => ({ ...prev, [providerName]: true }));
    try {
      const success = await onTestConnection(providerName);
      if (success && apiKeys[providerName]) {
        onProviderUpdate(providerName, apiKeys[providerName]);
      }
    } finally {
      setTesting(prev => ({ ...prev, [providerName]: false }));
    }
  };

  const getProviderIcon = (provider: DataProvider) => {
    if (provider.isConnected) {
      return <CheckCircle className="w-4 h-4 text-green-400" />;
    }
    if (provider.error) {
      return <AlertCircle className="w-4 h-4 text-red-400" />;
    }
    return <WifiOff className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
      >
        <Settings className="w-4 h-4" />
        Data Sources
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-96 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Data Provider Settings</h3>
            
            <div className="space-y-4">
              {providers.map(provider => (
                <div key={provider.name} className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getProviderIcon(provider)}
                      <span className="font-medium text-white">{provider.name}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      provider.isConnected ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-300'
                    }`}>
                      {provider.isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>

                  {provider.error && (
                    <div className="mb-3 p-2 bg-red-900/20 border border-red-700 rounded text-red-400 text-sm">
                      {provider.error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="block text-sm text-gray-400">API Key</label>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        value={apiKeys[provider.name] || ''}
                        onChange={(e) => setApiKeys(prev => ({ ...prev, [provider.name]: e.target.value }))}
                        placeholder="Enter API key..."
                        className="flex-1 bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white text-sm"
                      />
                      <button
                        onClick={() => handleTestConnection(provider.name)}
                        disabled={!apiKeys[provider.name] || testing[provider.name]}
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 rounded text-white text-sm transition-colors"
                      >
                        {testing[provider.name] ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          'Test'
                        )}
                      </button>
                    </div>
                  </div>

                  {provider.lastUpdate && (
                    <div className="mt-2 text-xs text-gray-400">
                      Last update: {provider.lastUpdate.toLocaleTimeString()}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700 rounded">
              <h4 className="text-sm font-medium text-blue-300 mb-2">Getting API Keys:</h4>
              <ul className="text-xs text-blue-200 space-y-1">
                <li>• <strong>Alpha Vantage:</strong> Free at alphavantage.co</li>
                <li>• <strong>Twelve Data:</strong> Free tier at twelvedata.com</li>
                <li>• <strong>Finnhub:</strong> Free tier at finnhub.io</li>
              </ul>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded text-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataProviderSettings;