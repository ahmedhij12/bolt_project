"""
Setup script for MT5 integration
This script helps configure and test the MT5 connection
"""

import MetaTrader5 as mt5
import sys
import os
from datetime import datetime

def check_mt5_installation():
    """Check if MT5 is properly installed"""
    try:
        if not mt5.initialize():
            print("❌ MT5 not found or not properly installed")
            print("Please install MetaTrader 5 from: https://www.metatrader5.com/")
            return False
        
        print("✅ MT5 found and initialized")
        
        # Get MT5 version info
        version = mt5.version()
        if version:
            print(f"   Version: {version[0]}")
            print(f"   Build: {version[1]}")
            print(f"   Release: {version[2]}")
        
        mt5.shutdown()
        return True
        
    except Exception as e:
        print(f"❌ Error checking MT5: {e}")
        return False

def test_connection(account, password, server):
    """Test MT5 connection with provided credentials"""
    try:
        if not mt5.initialize():
            print("❌ Failed to initialize MT5")
            return False
        
        print(f"Testing connection to account {account} on server {server}...")
        
        # Attempt to login
        if not mt5.login(account, password, server):
            error = mt5.last_error()
            print(f"❌ Login failed: {error}")
            return False
        
        print("✅ Successfully connected to MT5 account")
        
        # Get account info
        account_info = mt5.account_info()
        if account_info:
            print(f"   Account: {account_info.login}")
            print(f"   Server: {account_info.server}")
            print(f"   Company: {account_info.company}")
            print(f"   Currency: {account_info.currency}")
            print(f"   Balance: {account_info.balance}")
            print(f"   Equity: {account_info.equity}")
            print(f"   Margin: {account_info.margin}")
        
        # Test symbol data
        print("\nTesting symbol data retrieval...")
        symbols = ['XAUUSD', 'EURUSD', 'GBPUSD', 'USDJPY']
        
        for symbol in symbols:
            symbol_info = mt5.symbol_info(symbol)
            if symbol_info:
                print(f"   ✅ {symbol}: Available")
                
                # Get a few recent bars
                rates = mt5.copy_rates_from_pos(symbol, mt5.TIMEFRAME_H1, 0, 5)
                if rates is not None and len(rates) > 0:
                    latest = rates[-1]
                    print(f"      Latest: {latest['close']}")
                else:
                    print(f"      ⚠️  No rate data available")
            else:
                print(f"   ❌ {symbol}: Not available")
        
        mt5.shutdown()
        return True
        
    except Exception as e:
        print(f"❌ Connection test failed: {e}")
        mt5.shutdown()
        return False

def create_config_file(account, password, server):
    """Create a configuration file for the MT5 connector"""
    config_content = f"""# MT5 Configuration
# Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

MT5_ACCOUNT={account}
MT5_PASSWORD={password}
MT5_SERVER={server}

# Backend Configuration
BACKEND_URL=http://localhost:3001

# Data Stream Configuration
SYMBOLS=XAUUSD,EURUSD,GBPUSD,USDJPY
UPDATE_INTERVAL=60

# Trading Configuration
MAGIC_NUMBER=234000
DEVIATION=20
"""
    
    with open('.env', 'w') as f:
        f.write(config_content)
    
    print("✅ Configuration file created: .env")

def main():
    """Main setup function"""
    print("🔧 MT5 Integration Setup")
    print("=" * 30)
    
    # Check MT5 installation
    if not check_mt5_installation():
        sys.exit(1)
    
    print("\n📝 Please provide your MT5 credentials:")
    print("(You can find these in your MT5 terminal under Tools > Options > Server)")
    
    # Get user input
    try:
        account = int(input("MT5 Account Number: "))
        password = input("MT5 Password: ")
        server = input("MT5 Server: ")
        
        print("\n🔍 Testing connection...")
        
        if test_connection(account, password, server):
            print("\n✅ Connection successful!")
            
            # Ask if user wants to create config file
            create_config = input("\nCreate configuration file? (y/n): ").lower().strip()
            if create_config == 'y':
                create_config_file(account, password, server)
            
            print("\n🎉 Setup complete!")
            print("\nNext steps:")
            print("1. Install Python dependencies: pip install -r requirements.txt")
            print("2. Start the backend server: cd backend && npm start")
            print("3. Run the MT5 connector: python mt5_connector.py --account {account} --password {password} --server {server}")
            
        else:
            print("\n❌ Connection failed. Please check your credentials and try again.")
            
    except ValueError:
        print("❌ Invalid account number. Please enter a valid number.")
    except KeyboardInterrupt:
        print("\n\n👋 Setup cancelled by user.")
    except Exception as e:
        print(f"❌ Setup error: {e}")

if __name__ == "__main__":
    main()