export default function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  return (
    <div style={{ minHeight: '100vh', background: '#09090b', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <a href="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', textDecoration: 'none' }}>🚀 LaunchPad</a>
          <p style={{ color: '#a1a1aa', marginTop: '0.5rem' }}>Sign in to your account</p>
        </div>

        <div style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '1rem', padding: '2rem' }}>
          {/* Plain HTML form — no JS required */}
          <form method="POST" action="/api/auth/login">
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="email" style={{ display: 'block', color: '#d4d4d8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Email</label>
              <input
                id="email"
                name="email"
                type="email"
                defaultValue="admin@launchpad.app"
                required
                style={{ width: '100%', padding: '0.75rem', background: '#27272a', border: '1px solid #3f3f46', borderRadius: '0.5rem', color: 'white', fontSize: '1rem', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="password" style={{ display: 'block', color: '#d4d4d8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Password</label>
              <input
                id="password"
                name="password"
                type="password"
                defaultValue="12345678"
                required
                style={{ width: '100%', padding: '0.75rem', background: '#27272a', border: '1px solid #3f3f46', borderRadius: '0.5rem', color: 'white', fontSize: '1rem', boxSizing: 'border-box' }}
              />
            </div>

            <button
              type="submit"
              style={{ width: '100%', padding: '0.875rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '0.5rem', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' }}
            >
              Sign in →
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', color: '#71717a', marginTop: '1.5rem' }}>
          Don&apos;t have an account?{' '}
          <a href="/signup" style={{ color: '#818cf8', textDecoration: 'none' }}>Sign up</a>
        </p>
      </div>
    </div>
  )
}
