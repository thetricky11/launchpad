export default function LoginPage() {
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
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,97,23,0.12)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(82,64,204,0.2)', pointerEvents: 'none' }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, zIndex: 1 }}>
          <img src="/brand-logo.avif" alt="LaunchPad" style={{ height: 40 }} />
          <div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: '1.2rem', lineHeight: 1.1 }}>LaunchPad</div>
            <div style={{ color: '#8E82E2', fontSize: '0.65rem', letterSpacing: '0.1em', lineHeight: 1.1 }}>BY CREATORDB</div>
          </div>
        </div>

        {/* Tagline */}
        <div style={{ zIndex: 1 }}>
          <h2 style={{ color: '#fff', fontSize: '1.6rem', fontWeight: 800, lineHeight: 1.3, marginBottom: '1rem' }}>
            AI-powered influencer campaigns in seconds
          </h2>
          <p style={{ color: '#8E82E2', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Discover creators, generate briefs, automate outreach — and track ROI from one dashboard.
          </p>
          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {['2M+ creators indexed', 'GPT-4 fit scoring', 'Automated personalized outreach'].map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,97,23,0.25)', border: '1px solid #FF6117', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#FF7B3E' }}>✓</div>
                <span style={{ color: '#D2CDF3', fontSize: '0.875rem' }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          {/* Mobile logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '2rem' }} className="md:hidden">
            <img src="/brand-logo.avif" alt="LaunchPad" style={{ height: 36 }} />
            <div>
              <div style={{ color: '#1C1549', fontWeight: 800, fontSize: '1.1rem', lineHeight: 1.1 }}>LaunchPad</div>
              <div style={{ color: '#7B7B84', fontSize: '0.6rem', letterSpacing: '0.08em' }}>BY CREATORDB</div>
            </div>
          </div>

          <h1 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#1C1549', marginBottom: '0.5rem' }}>Welcome back</h1>
          <p style={{ color: '#7B7B84', marginBottom: '2rem', fontSize: '0.95rem' }}>Sign in to your LaunchPad account</p>

          <div style={{ background: '#fff', border: '1px solid #DADADE', borderRadius: 16, padding: '2rem', boxShadow: '0 2px 16px rgba(28,21,73,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <img src="/brand-logo.avif" alt="LaunchPad" style={{ height: 40 }} />
            </div>
            <form method="POST" action="/api/auth/login">
              <div style={{ marginBottom: '1.25rem' }}>
                <label htmlFor="email" style={{ display: 'block', color: '#1F1F21', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue="admin@launchpad.app"
                  required
                  style={{ width: '100%', padding: '0.75rem 1rem', background: '#F6F7F9', border: '1.5px solid #DADADE', borderRadius: 8, color: '#1F1F21', fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: '1.75rem' }}>
                <label htmlFor="password" style={{ display: 'block', color: '#1F1F21', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  defaultValue="12345678"
                  required
                  style={{ width: '100%', padding: '0.75rem 1rem', background: '#F6F7F9', border: '1.5px solid #DADADE', borderRadius: 8, color: '#1F1F21', fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none' }}
                />
              </div>

              <button
                type="submit"
                style={{ width: '100%', padding: '0.875rem', background: '#FF6117', color: '#fff', border: 'none', borderRadius: 10, fontSize: '1rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 16px rgba(255,97,23,0.3)', transition: 'background 0.15s' }}
              >
                Sign in →
              </button>
            </form>
          </div>

          <p style={{ textAlign: 'center', color: '#7B7B84', marginTop: '1.5rem', fontSize: '0.9rem' }}>
            Don&apos;t have an account?{' '}
            <a href="/signup" style={{ color: '#FF6117', textDecoration: 'none', fontWeight: 600 }}>Create one free</a>
          </p>
        </div>
      </div>
    </div>
  )
}
