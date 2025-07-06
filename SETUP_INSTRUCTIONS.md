# Step-by-Step Setup Instructions

## Prerequisites Setup

### 1. Install Required Software

#### On Windows (Required for MT5):
- **MetaTrader 5**: Download from [https://www.metatrader5.com/](https://www.metatrader5.com/)
- **Python 3.8+**: Download from [https://www.python.org/downloads/](https://www.python.org/downloads/)
- **Node.js 18+**: Download from [https://nodejs.org/](https://nodejs.org/)

#### On Mac/Linux (Frontend & Backend only):
- **Node.js 18+**: Download from [https://nodejs.org/](https://nodejs.org/)

### 2. Prepare Your Credentials

You'll need:
- **Supabase Account**: Sign up at [https://supabase.com/](https://supabase.com/)
- **OpenAI API Key**: Get from [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- **MT5 Account**: Real trading account from a broker

## Database Setup

### 1. Create Supabase Project
1. Go to [https://supabase.com/](https://supabase.com/)
2. Click "Start your project"
3. Create new organization and project
4. Wait for project to be ready

### 2. Get Supabase Credentials
1. In your Supabase project dashboard
2. Go to Settings → API
3. Copy your `Project URL` and `anon public key`
4. Save these for later use

### 3. Connect Database
1. In the application, click "Connect to Supabase" button (top right)
2. Enter your Supabase credentials
3. The database schema will be created automatically

## Frontend Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env` file in the root directory:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Start Frontend
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Backend Setup

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Configure Backend Environment
Create `backend/.env` file:
```
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Security
JWT_SECRET=your_random_jwt_secret_here
```

**Important**: Get the `SUPABASE_SERVICE_ROLE_KEY` from Supabase Settings → API → service_role key

### 3. Start Backend Server
```bash
cd backend
npm start
```

The backend will be available at `http://localhost:3001`

## MT5 Integration Setup (Windows Only)

### 1. Install MT5 Python Package
```bash
cd mt5_integration
pip install -r requirements.txt
```

### 2. Setup MT5 Connection
```bash
python setup_mt5.py
```

Follow the prompts:
- Enter your MT5 account number
- Enter your MT5 password
- Enter your MT5 server name
- Test the connection

### 3. Get MT5 Credentials
If you don't have MT5 credentials:
1. Open MetaTrader 5
2. Go to Tools → Options → Server tab
3. Note your Login, Server, and Password
4. Make sure you can connect to your broker

### 4. Start MT5 Connector
```bash
python mt5_connector.py --account YOUR_ACCOUNT --password YOUR_PASSWORD --server YOUR_SERVER
```

Replace with your actual credentials.

## Application Usage

### 1. Create Account
1. Visit `http://localhost:5173`
2. Click "Create Account"
3. Fill in your details
4. Sign up and log in

### 2. Connect MT5 Account
1. In the dashboard, find "MT5 Connection" panel
2. Click "Connect MT5"
3. Enter your MT5 credentials
4. Verify connection shows "Connected"

### 3. Add OpenAI API Key
1. Go to Settings (if available) or
2. When generating first signal, you'll be prompted
3. Enter your OpenAI API key
4. Key will be securely stored

### 4. Generate First Signal
1. Ensure MT5 is connected and running
2. Market data should be flowing
3. Click "Generate Signal" or wait for automatic generation
4. View your signal in the dashboard

### 5. Monitor Performance
1. Check the dashboard for real-time metrics
2. Use Signal History page for detailed analysis
3. Track your P&L and win rate

## Troubleshooting

### Database Issues
- **Connection Failed**: Check Supabase credentials
- **Schema Not Created**: Click "Connect to Supabase" button
- **Permission Errors**: Verify service role key is correct

### MT5 Issues
- **Connection Failed**: 
  - Verify MT5 is running
  - Check credentials are correct
  - Ensure you can manually connect in MT5
  - Try different server endpoints

### Backend Issues
- **Server Not Starting**: Check if port 3001 is free
- **API Errors**: Check environment variables
- **CORS Issues**: Verify FRONTEND_URL is correct

### Frontend Issues
- **White Screen**: Check browser console for errors
- **Auth Not Working**: Verify Supabase credentials
- **API Calls Failing**: Ensure backend is running

## Production Deployment

### 1. Frontend Deployment
```bash
# Build for production
npm run build

# Deploy to Vercel
npx vercel deploy

# Or deploy to Netlify
# Upload dist/ folder to Netlify
```

### 2. Backend Deployment
```bash
# Deploy to Railway
railway login
railway init
railway up

# Or deploy to Heroku
heroku create your-app-name
git push heroku main
```

### 3. MT5 Integration
- Must run on Windows machine with MT5
- Set up as Windows service for reliability
- Configure firewall rules
- Use VPS with Windows if needed

## Security Considerations

### Environment Variables
- Never commit `.env` files
- Use strong, unique passwords
- Rotate API keys regularly

### Database Security
- RLS is enabled by default
- Users can only access their own data
- API keys are encrypted

### API Security
- Rate limiting is implemented
- JWT tokens expire automatically
- All endpoints require authentication

## Support

### Common Commands
```bash
# Check MT5 connection
python mt5_integration/setup_mt5.py

# Test backend API
curl http://localhost:3001/api/health

# Clear browser cache
# In Chrome: Ctrl+Shift+Delete

# View logs
# Frontend: Check browser console
# Backend: Check terminal output
# MT5: Check Python script output
```

### Getting Help
1. Check the logs in each component
2. Verify all environment variables
3. Test each component independently
4. Check network connectivity between components

### Next Steps
Once everything is working:
1. Add more symbols to track
2. Customize AI signal generation parameters
3. Set up automated trading (if desired)
4. Configure alerts and notifications
5. Add more advanced analytics