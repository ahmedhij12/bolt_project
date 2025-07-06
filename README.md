# AI Trading Signal Prediction Application

A comprehensive full-stack web application that provides AI-powered trading signal predictions using OpenAI and real-time MetaTrader 5 (MT5) integration.

## Features

### 🔐 User Authentication
- Secure signup and signin with email/password
- Production-ready authentication using Supabase
- User profile management with MT5 credentials

### 📊 Dashboard
- Real-time trading dashboard with live charts
- Account summary and performance metrics
- Recent trading signals display
- MT5 connection status monitoring

### 📈 MT5 Integration
- Real-time connection to MetaTrader 5 terminals
- Live market data streaming (OHLC, volume, tick data)
- Support for multiple symbols (XAUUSD, NASDAQ, EURUSD, etc.)
- Secure credential validation

### 🤖 AI Signal Generation
- OpenAI-powered market analysis
- Automated signal generation with entry/exit points
- Confidence scoring for each signal
- Technical analysis explanations

### 📋 Signal Management
- Complete signal history tracking
- Signal filtering and search capabilities
- Performance analytics and P&L tracking
- Export functionality for trading records

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **React Router** for navigation
- **Supabase** for authentication and database

### Backend
- **Node.js** with Express.js
- **Supabase** for database and authentication
- **OpenAI API** for signal generation
- **MT5 Python Integration** for market data

### Database
- **PostgreSQL** (via Supabase)
- Row Level Security (RLS) enabled
- Real-time subscriptions

## Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+ (for MT5 integration)
- MetaTrader 5 installed on Windows
- Supabase account
- OpenAI API key

### 1. Clone and Setup Frontend

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Add your Supabase credentials to .env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Setup Database

1. Create a new Supabase project
2. Click "Connect to Supabase" in the top right of the application
3. The database schema will be automatically created

### 3. Setup Backend Server

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure environment variables
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
FRONTEND_URL=http://localhost:5173
```

### 4. Setup MT5 Integration

```bash
# Navigate to MT5 integration directory
cd mt5_integration

# Install Python dependencies
pip install -r requirements.txt

# Run setup script
python setup_mt5.py
```

Follow the prompts to:
- Test your MT5 installation
- Validate your MT5 credentials
- Create configuration files

### 5. Start the Application

```bash
# Terminal 1: Start frontend
npm run dev

# Terminal 2: Start backend
cd backend
npm start

# Terminal 3: Start MT5 connector (Windows only)
cd mt5_integration
python mt5_connector.py --account YOUR_ACCOUNT --password YOUR_PASSWORD --server YOUR_SERVER
```

## Configuration

### Environment Variables

#### Frontend (.env)
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### Backend (.env)
```
PORT=3001
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
FRONTEND_URL=http://localhost:5173
```

#### MT5 Integration (.env)
```
MT5_ACCOUNT=your_mt5_account
MT5_PASSWORD=your_mt5_password
MT5_SERVER=your_mt5_server
BACKEND_URL=http://localhost:3001
```

## Usage

### 1. User Registration
1. Navigate to the application
2. Click "Create Account"
3. Fill in your details and submit
4. You'll be automatically signed in

### 2. Connect MT5 Account
1. Go to Dashboard
2. Click "Connect MT5" in the MT5 Connection panel
3. Enter your MT5 credentials
4. Verify the connection status

### 3. Generate AI Signals
1. Ensure MT5 is connected
2. Provide your OpenAI API key in settings
3. Signals will be automatically generated based on market analysis
4. View signals in the dashboard or signals history page

### 4. Monitor Performance
1. Check the dashboard for real-time metrics
2. Use the Signal History page for detailed analysis
3. Export your trading history for external analysis

## MT5 Integration Details

### Supported Features
- Real-time market data streaming
- Historical data retrieval
- Multiple timeframes (M1, M5, M15, M30, H1, H4, D1)
- Symbol information and specifications
- Tick data streaming
- Trade execution (optional)

### Supported Symbols
- XAUUSD (Gold)
- EURUSD, GBPUSD, USDJPY (Forex majors)
- NASDAQ, SP500 (Indices)
- Custom symbols (configurable)

### Data Flow
1. MT5 Python connector fetches real-time data
2. Data is sent to backend API
3. Backend stores data in Supabase
4. Frontend displays live charts and data
5. AI analyzes data and generates signals

## API Endpoints

### Authentication
- `POST /api/auth/signin` - User signin
- `POST /api/auth/signup` - User signup
- `POST /api/auth/signout` - User signout

### MT5 Integration
- `POST /api/mt5/connect` - Connect MT5 account
- `GET /api/mt5/data/:symbol` - Get market data
- `POST /api/mt5/tick` - Receive tick data

### Signal Management
- `GET /api/signals` - Get user signals
- `POST /api/signals/generate` - Generate new signal
- `PUT /api/signals/:id` - Update signal status

### API Keys
- `POST /api/keys` - Store API keys
- `GET /api/keys` - Retrieve API keys

## Security

### Authentication
- JWT-based authentication
- Row Level Security (RLS) in database
- API key encryption
- Rate limiting on API endpoints

### Data Protection
- All user data is isolated by user ID
- MT5 credentials are encrypted
- API keys are securely stored
- HTTPS enforced in production

## Troubleshooting

### Common Issues

#### MT5 Connection Failed
- Verify MT5 is running and logged in
- Check account credentials
- Ensure Windows firewall allows connections
- Try different server endpoints

#### No Market Data
- Verify symbol is available in MT5
- Check market hours
- Ensure symbol is visible in Market Watch
- Try different timeframes

#### AI Signal Generation Failed
- Verify OpenAI API key is valid
- Check API usage limits
- Ensure sufficient market data is available
- Review OpenAI API status

#### Frontend Not Loading
- Check if backend server is running
- Verify Supabase credentials
- Clear browser cache
- Check console for errors

### Support
For technical support:
1. Check the logs in each component
2. Verify all environment variables
3. Test each component independently
4. Check network connectivity

## Production Deployment

### Frontend
- Deploy to Vercel, Netlify, or similar
- Update environment variables for production
- Configure custom domain

### Backend
- Deploy to Railway, Heroku, or VPS
- Set up production database
- Configure environment variables
- Set up monitoring and logging

### MT5 Integration
- Must run on Windows machine with MT5
- Set up as Windows service for reliability
- Configure firewall rules
- Set up monitoring and alerts

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Disclaimer

This application is for educational and informational purposes only. Trading involves significant risk, and past performance does not guarantee future results. Always do your own research and consider consulting with a financial advisor before making trading decisions.