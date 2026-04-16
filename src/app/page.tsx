import Link from 'next/link'

const features = [
  {
    icon: '🔍',
    title: 'Creator discovery',
    desc: 'Search 2M+ creators by niche, follower count, engagement rate, and audience demographics.',
  },
  {
    icon: '🤖',
    title: 'AI fit scoring',
    desc: 'Every creator is scored against your brand brief using GPT-4. Know who will perform before you spend.',
  },
  {
    icon: '✉️',
    title: 'Automated outreach',
    desc: 'Personalized emails generated and sent at scale. Open rates 3× higher than generic templates.',
  },
  {
    icon: '📋',
    title: 'Campaign briefs',
    desc: 'AI-generated campaign strategy, key messages, hashtags, and CTA — ready to share in one click.',
  },
  {
    icon: '📊',
    title: 'Live tracking',
    desc: 'Monitor posts, views, and conversions in real-time. Know your ROI before the campaign ends.',
  },
  {
    icon: '📄',
    title: 'Contract generation',
    desc: 'Auto-generate creator contracts with deliverables, payment terms, and usage rights baked in.',
  },
]

const stats = [
  { label: 'Creators indexed', value: '2M+' },
  { label: 'Campaigns generated', value: '12K+' },
  { label: 'Avg. ROI improvement', value: '3.2×' },
  { label: 'Hours saved per campaign', value: '40+' },
]

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#F6F7F9', color: '#1F1F21' }}>
      {/* Top nav */}
      <header style={{ background: '#1C1549', borderBottom: '1px solid #261D64' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/brand-logo.avif" alt="LaunchPad" style={{ height: 32 }} />
            <div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: '1.05rem', lineHeight: 1.1 }}>LaunchPad</div>
              <div style={{ color: '#BBB4EC', fontSize: '0.6rem', letterSpacing: '0.08em', lineHeight: 1.1 }}>BY CREATORDB</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Link href="/login" style={{ color: '#D2CDF3', textDecoration: 'none', fontSize: '0.9rem' }}>Sign in</Link>
            <Link href="/signup" style={{ background: '#FF6117', color: '#fff', padding: '0.45rem 1.2rem', borderRadius: 8, textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #35288A 0%, #1C1549 40%, #FF6117 100%)', padding: '6rem 1.5rem 5rem' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,123,62,0.15)', border: '1px solid rgba(255,123,62,0.35)', borderRadius: 100, padding: '0.35rem 1rem', marginBottom: '2rem' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF7B3E', display: 'inline-block' }} />
            <span style={{ color: '#FFD7C5', fontSize: '0.8rem', fontWeight: 500 }}>Powered by GPT-4 + CreatorDB</span>
          </div>

          {/* Logo mark */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <img src="/brand-logo.avif" alt="LaunchPad" style={{ height: 48 }} />
          </div>

          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, color: '#fff', lineHeight: 1.1, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            LaunchPad
          </h1>
          <div style={{ color: '#BBB4EC', fontSize: '0.9rem', letterSpacing: '0.12em', fontWeight: 500, marginBottom: '1.5rem' }}>
            BY CREATORDB
          </div>
          <p style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', color: '#D2CDF3', marginBottom: '1rem', lineHeight: 1.6, maxWidth: 620, margin: '0 auto 1rem' }}>
            AI-powered influencer marketing campaigns in seconds
          </p>
          <p style={{ color: '#8E82E2', fontSize: '0.85rem', letterSpacing: '0.06em', marginBottom: '3rem' }}>
            Powered by CreatorDB API V.3
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/signup" style={{ background: '#FF6117', color: '#fff', padding: '0.875rem 2.5rem', borderRadius: 12, textDecoration: 'none', fontWeight: 700, fontSize: '1rem', display: 'inline-block', boxShadow: '0 4px 24px rgba(255,97,23,0.4)' }}>
              Get started free →
            </Link>
            <Link href="/login" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '0.875rem 2.5rem', borderRadius: 12, textDecoration: 'none', fontWeight: 600, fontSize: '1rem', display: 'inline-block', backdropFilter: 'blur(8px)' }}>
              See demo
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ background: '#1C1549', padding: '2.5rem 1.5rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '2rem', textAlign: 'center' }}>
          {stats.map(s => (
            <div key={s.label}>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#FF7B3E', lineHeight: 1 }}>{s.value}</div>
              <div style={{ color: '#8E82E2', fontSize: '0.85rem', marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, color: '#1C1549', marginBottom: '1rem' }}>
              Everything you need to run influencer campaigns
            </h2>
            <p style={{ color: '#7B7B84', fontSize: '1.1rem', maxWidth: 520, margin: '0 auto' }}>
              From creator discovery to contract signing — one platform, end to end.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {features.map((f, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid #DADADE', borderRadius: 16, padding: '2rem', transition: 'box-shadow 0.2s' }}>
                <div style={{ width: 52, height: 52, background: 'linear-gradient(135deg, #FFF6F2, #FFD7C5)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '1rem' }}>
                  {f.icon}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1C1549', marginBottom: 8 }}>{f.title}</h3>
                <p style={{ color: '#7B7B84', fontSize: '0.9rem', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section style={{ background: 'linear-gradient(135deg, #35288A, #1C1549)', padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>
            Ready to launch?
          </h2>
          <p style={{ color: '#BBB4EC', fontSize: '1.1rem', marginBottom: '2.5rem' }}>
            Join thousands of brands running smarter influencer campaigns with LaunchPad.
          </p>
          <Link href="/signup" style={{ background: '#FF6117', color: '#fff', padding: '1rem 3rem', borderRadius: 12, textDecoration: 'none', fontWeight: 700, fontSize: '1.1rem', display: 'inline-block', boxShadow: '0 4px 24px rgba(255,97,23,0.45)' }}>
            Get started free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#1F1F21', padding: '2.5rem 1.5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/brand-logo.avif" alt="LaunchPad" style={{ height: 28 }} />
            <div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: '0.95rem', lineHeight: 1.1 }}>LaunchPad</div>
              <div style={{ color: '#626269', fontSize: '0.6rem', letterSpacing: '0.08em' }}>BY CREATORDB</div>
            </div>
          </div>
          <div style={{ color: '#505057', fontSize: '0.8rem' }}>
            © {new Date().getFullYear()} CreatorDB Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
