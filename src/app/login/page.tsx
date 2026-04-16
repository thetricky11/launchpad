'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'same-origin',
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        setError(data.error || 'Login failed')
        setLoading(false)
        return
      }
      
      // Hard redirect
      window.location.replace('/dashboard')
    } catch (err) {
      setError('Network error — please try again')
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#09090b', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', textDecoration: 'none' }}>🚀 LaunchPad</Link>
          <p style={{ color: '#a1a1aa', marginTop: '0.5rem' }}>Sign in to your account</p>
        </div>

        <div style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '1rem', padding: '2rem' }}>
          {error && (
            <div style={{ background: '#7f1d1d', color: '#fca5a5', padding: '0.75rem 1rem', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', color: '#d4d4d8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Email</label>
              <input
                type="email"
                placeholder="admin@launchpad.app"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '0.75rem', background: '#27272a', border: '1px solid #3f3f46', borderRadius: '0.5rem', color: 'white', fontSize: '1rem', boxSizing: 'border-box' }}
              />
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', color: '#d4d4d8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '0.75rem', background: '#27272a', border: '1px solid #3f3f46', borderRadius: '0.5rem', color: 'white', fontSize: '1rem', boxSizing: 'border-box' }}
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '0.875rem', background: loading ? '#4338ca' : '#4f46e5', color: 'white', border: 'none', borderRadius: '0.5rem', fontSize: '1rem', fontWeight: '600', cursor: loading ? 'wait' : 'pointer' }}
            >
              {loading ? 'Signing in...' : 'Sign in →'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', color: '#71717a', marginTop: '1.5rem' }}>
          Don&apos;t have an account?{' '}
          <Link href="/signup" style={{ color: '#818cf8', textDecoration: 'none' }}>Sign up</Link>
        </p>
      </div>
    </div>
  )
}
