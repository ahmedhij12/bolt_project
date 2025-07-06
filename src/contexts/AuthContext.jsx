import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mt5Credentials, setMt5Credentials] = useState(null);

  // Load user data from localStorage on mount
  useEffect(() => {
    const loadUserData = () => {
      try {
        const savedUser = localStorage.getItem('user');
        const savedCredentials = localStorage.getItem('mt5Credentials');
        
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
        
        if (savedCredentials) {
          setMt5Credentials(JSON.parse(savedCredentials));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        // Clear corrupted data
        localStorage.removeItem('user');
        localStorage.removeItem('mt5Credentials');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      
      // Simulate API call - replace with your actual authentication
      const userData = {
        id: Date.now(),
        email,
        name: email.split('@')[0],
        loginTime: new Date().toISOString()
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email, password, confirmPassword) => {
    try {
      setIsLoading(true);
      
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      // Simulate API call - replace with your actual registration
      const userData = {
        id: Date.now(),
        email,
        name: email.split('@')[0],
        signupTime: new Date().toISOString()
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const connectMT5 = async (server, login, password) => {
    try {
      setIsLoading(true);
      
      const credentials = {
        server,
        login,
        password,
        connectedAt: new Date().toISOString()
      };
      
      setMt5Credentials(credentials);
      localStorage.setItem('mt5Credentials', JSON.stringify(credentials));
      
      return { success: true, credentials };
    } catch (error) {
      console.error('MT5 connection error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setMt5Credentials(null);
    localStorage.removeItem('user');
    localStorage.removeItem('mt5Credentials');
  };

  const value = {
    user,
    mt5Credentials,
    isLoading,
    login,
    signup,
    connectMT5,
    logout,
    isAuthenticated: !!user,
    isMT5Connected: !!mt5Credentials
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};