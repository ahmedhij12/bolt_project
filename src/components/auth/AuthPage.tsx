import React, { useState } from 'react'
import { AuthForm } from './AuthForm'

export const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')

  return (
    <AuthForm 
      mode={mode} 
      onToggleMode={() => setMode(mode === 'signin' ? 'signup' : 'signin')} 
    />
  )
}