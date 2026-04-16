import { cookies } from 'next/headers'
import { parseSessionToken } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('launchpad_session')?.value
  const user = token ? parseSessionToken(token) : null
  
  if (!user) redirect('/login')

  return (
    <div style={{ minHeight: '100vh', background: '#09090b', color: 'white' }}>
      {/* Nav */}
      <nav style={{ borderBottom: '1px solid #27272a', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a href="/dashboard" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', textDecoration: 'none' }}>🚀 LaunchPad</a>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <a href="/campaigns/new" style={{ background: '#4f46e5', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '600' }}>
            + New Campaign
          </a>
          <a href="/billing" style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '0.875rem' }}>Billing</a>
          <span style={{ color: '#71717a', fontSize: '0.875rem' }}>{user.email}</span>
        </div>
      </nav>

      {/* Main content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Welcome back, {user.name} 👋</h1>
        <p style={{ color: '#a1a1aa', marginBottom: '2rem' }}>Here&apos;s your campaign overview</p>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Total Campaigns', value: '0', icon: '📊' },
            { label: 'Active Campaigns', value: '0', icon: '🟢' },
            { label: 'Creators Contacted', value: '0', icon: '📧' },
            { label: 'Estimated Reach', value: '0', icon: '👁️' },
          ].map(stat => (
            <div key={stat.label} style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '0.75rem', padding: '1.5rem' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{stat.icon}</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{stat.value}</div>
              <div style={{ color: '#71717a', fontSize: '0.875rem' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        <div style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '1rem', padding: '3rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Create your first campaign</h2>
          <p style={{ color: '#a1a1aa', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
            Use AI to generate a complete influencer marketing campaign in seconds.
          </p>
          <a href="/campaigns/new" style={{ display: 'inline-block', background: '#4f46e5', color: 'white', padding: '0.75rem 2rem', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: '600' }}>
            + New Campaign →
          </a>
        </div>
      </div>
    </div>
  )
}
