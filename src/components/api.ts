import { getAccessToken } from './auth'

// Call your backend MT5 price API with token
export async function fetchMt5Price(symbol: string) {
  const token = getAccessToken()
  if (!token) throw new Error('No access token found. Please login.')

  const res = await fetch(`http://localhost:3001/api/mt5/price/${symbol}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Failed to fetch MT5 data')
  }

  return res.json()
}
