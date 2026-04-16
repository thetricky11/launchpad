import { cookies } from 'next/headers'
import { parseSessionToken } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('launchpad_session')?.value
  const user = token ? parseSessionToken(token) : null

  if (!user) redirect('/login')

  const stats = [
    { label: 'Total campaigns', value: '0', icon: '📊', accent: '#FF6117' },
    { label: 'Active campaigns', value: '0', icon: '🟢', accent: '#2AE5B0' },
    { label: 'Creators contacted', value: '0', icon: '📧', accent: '#5240CC' },
    { label: 'Estimated reach', value: '0', icon: '👁️', accent: '#FF7B3E' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#F6F7F9' }}>
      <nav style={{ background: '#1C1549', borderBottom: '1px solid #261D64', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <img src="/brand-logo.avif" alt="LaunchPad" style={{ height: 32 }} />
            <div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: '1.05rem', lineHeight: 1.1 }}>LaunchPad</div>
              <div style={{ color: '#BBB4EC', fontSize: '0.6rem', letterSpacing: '0.08em', lineHeight: 1.1 }}>BY CREATORDB</div>
            </div>
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <a href="/dashboard" style={{ color: '#FF7B3E', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}>Dashboard</a>
            <a href="/campaigns" style={{ color: '#D2CDF3', textDecoration: 'none', fontSize: '0.875rem' }}>Campaigns</a>
            <form method="POST" action="/api/auth/logout" style={{ margin: 0 }}>
              <button type="submit" style={{ background: 'rgba(255,97,23,0.15)', border: '1px solid rgba(255,97,23,0.3)', color: '#FF7B3E', padding: '0.4rem 1rem', borderRadius: 8, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>Sign out</button>
            </form>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1C1549', marginBottom: 4 }}>
              Welcome back, {user.name} 👋
            </h1>
            <p style={{ color: '#7B7B84', fontSize: '0.95rem' }}>Here&apos;s your campaign overview</p>
          </div>
          <a href="/campaigns/new" style={{
            background: '#FF6117',
            color: '#fff',
            padding: '0.6rem 1.4rem',
            borderRadius: 10,
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '0.9rem',
            boxShadow: '0 4px 16px rgba(255,97,23,0.3)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}>
            + New Campaign
          </a>
        </div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          {stats.map(stat => (
            <div key={stat.label} style={{
              background: '#fff',
              border: '1px solid #DADADE',
              borderRadius: 14,
              padding: '1.5rem',
              borderTop: `3px solid ${stat.accent}`,
              boxShadow: '0 2px 8px rgba(28,21,73,0.04)',
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>{stat.icon}</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1C1549', lineHeight: 1 }}>{stat.value}</div>
              <div style={{ color: '#7B7B84', fontSize: '0.85rem', marginTop: 6 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        <div style={{
          background: '#fff',
          border: '1px solid #DADADE',
          borderRadius: 20,
          padding: '4rem 2rem',
          textAlign: 'center',
          boxShadow: '0 2px 12px rgba(28,21,73,0.04)',
        }}>
          <div style={{
            width: 80,
            height: 80,
            background: 'linear-gradient(135deg, #FFF6F2, #FFD7C5)',
            borderRadius: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            margin: '0 auto 1.5rem',
          }}>
            🚀
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1C1549', marginBottom: 8 }}>
            Create your first campaign
          </h2>
          <p style={{ color: '#7B7B84', marginBottom: '2rem', maxWidth: 420, margin: '0 auto 2rem', lineHeight: 1.6, fontSize: '0.95rem' }}>
            Use AI to generate a complete influencer marketing campaign — creators, briefs, and outreach — in seconds.
          </p>
          <a href="/campaigns/new" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: '#FF6117',
            color: '#fff',
            padding: '0.85rem 2.5rem',
            borderRadius: 12,
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '0.95rem',
            boxShadow: '0 4px 20px rgba(255,97,23,0.35)',
          }}>
            + New Campaign →
          </a>

          <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #ECECEE', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '2rem', maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>
            {[
              { label: 'Creators indexed', value: '2M+' },
              { label: 'Avg. time to launch', value: '5 min' },
              { label: 'Avg. ROI improvement', value: '3.2×' },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FF6117' }}>{s.value}</div>
                <div style={{ color: '#9C9CA3', fontSize: '0.8rem', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
