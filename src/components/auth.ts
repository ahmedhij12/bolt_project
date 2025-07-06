import { createClient } from '@supabase/supabase-js'

// Use environment variables starting with VITE_ for Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Login user and save session in localStorage
export async function loginUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  if (data.session) {
    localStorage.setItem('supabase-auth-token', JSON.stringify(data.session))
    return data.session.access_token
  }
  throw new Error('Login failed: no session returned')
}

// Get access token from localStorage
export function getAccessToken() {
  const key = Object.keys(localStorage).find(k => k.endsWith('-auth-token'))
  if (!key) return null
  try {
    return JSON.parse(localStorage.getItem(key) || '{}').access_token
  } catch {
    return null
  }
}
