'use client'

import { useState } from 'react'
import { toast } from 'sonner'

const LogoIcon = () => (
  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 44, height: 44 }}>
    <circle cx="6" cy="6" r="3" fill="currentColor"/>
    <circle cx="18" cy="6" r="3" fill="currentColor"/>
    <circle cx="30" cy="6" r="3" fill="currentColor"/>
    <circle cx="6" cy="18" r="3" fill="currentColor"/>
    <circle cx="18" cy="18" r="3" fill="currentColor"/>
    <circle cx="30" cy="18" r="3" fill="currentColor"/>
    <circle cx="6" cy="30" r="3" fill="currentColor"/>
    <circle cx="18" cy="30" r="3" fill="currentColor"/>
    <circle cx="30" cy="30" r="3" fill="currentColor"/>
  </svg>
)

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Signup failed')
      toast.success('Account created!')
      window.location.href = '/onboarding'
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#F6F7F9' }}>
      {/* Left panel */}
      <div style={{
        width: '42%',
        minWidth: 320,
        background: 'linear-gradient(160deg, #1C1549 0%, #35288A 60%, #4333B0 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '3rem',
        position: 'relative',
        overflow: 'hidden',
      }} className="hidden md:flex">
        <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,97,23,0.12)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(82,64,204,0.2)', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#FF7B3E', zIndex: 1 }}>
          <img src="/brand-logo.avif" alt="LaunchPad" style={{ height: 56, borderRadius: 10 }} />
          <div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: '1.2rem', lineHeight: 1.1 }}>LaunchPad</div>
            <div style={{ color: '#8E82E2', fontSize: '0.65rem', letterSpacing: '0.1em', lineHeight: 1.1 }}>BY CREATORDB</div>
          </div>
        </div>

        <div style={{ zIndex: 1 }}>
          <h2 style={{ color: '#fff', fontSize: '1.6rem', fontWeight: 800, lineHeight: 1.3, marginBottom: '1rem' }}>
            Launch your first campaign in under 5 minutes
          </h2>
          <p style={{ color: '#8E82E2', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Set up your brand profile, tell us your goal, and let AI do the rest.
          </p>
          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {['Free to get started', 'No credit card required', 'Cancel any time'].map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,97,23,0.25)', border: '1px solid #FF6117', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#FF7B3E' }}>✓</div>
                <span style={{ color: '#D2CDF3', fontSize: '0.875rem' }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '2rem', color: '#FF6117' }} className="md:hidden">
            <img src="/brand-logo.avif" alt="LaunchPad" style={{ height: 56, borderRadius: 10 }} />
            <div>
              <div style={{ color: '#1C1549', fontWeight: 800, fontSize: '1.1rem', lineHeight: 1.1 }}>LaunchPad</div>
              <div style={{ color: '#7B7B84', fontSize: '0.6rem', letterSpacing: '0.08em' }}>BY CREATORDB</div>
            </div>
          </div>

          <h1 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#1C1549', marginBottom: '0.5rem' }}>Create your account</h1>
          <p style={{ color: '#7B7B84', marginBottom: '2rem', fontSize: '0.95rem' }}>Start running smarter influencer campaigns today</p>

          <div style={{ background: '#fff', border: '1px solid #DADADE', borderRadius: 16, padding: '2rem', boxShadow: '0 2px 16px rgba(28,21,73,0.06)' }}>
            <form onSubmit={handleSignup}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label htmlFor="email" style={{ display: 'block', color: '#1F1F21', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Work email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.75rem 1rem', background: '#F6F7F9', border: '1.5px solid #DADADE', borderRadius: 8, color: '#1F1F21', fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none' }}
                />
              </div>
              <div style={{ marginBottom: '1.75rem' }}>
                <label htmlFor="password" style={{ display: 'block', color: '#1F1F21', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={8}
                  style={{ width: '100%', padding: '0.75rem 1rem', background: '#F6F7F9', border: '1.5px solid #DADADE', borderRadius: 8, color: '#1F1F21', fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none' }}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{ width: '100%', padding: '0.875rem', background: loading ? '#FFB08B' : '#FF6117', color: '#fff', border: 'none', borderRadius: 10, fontSize: '1rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 16px rgba(255,97,23,0.3)', transition: 'background 0.15s' }}
              >
                {loading ? 'Creating account…' : 'Create account →'}
              </button>
            </form>
          </div>

          <p style={{ textAlign: 'center', color: '#7B7B84', marginTop: '1.5rem', fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <a href="/login" style={{ color: '#FF6117', textDecoration: 'none', fontWeight: 600 }}>Sign in</a>
          </p>
        </div>
      </div>
    </div>
  )
}
