'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Nav } from '@/components/nav'
import { toast } from 'sonner'
import dynamic from 'next/dynamic'

const RechartsWrapper = dynamic(() => import('recharts').then(mod => {
  const { PieChart, Pie, Cell, ResponsiveContainer } = mod
  return { default: ({ data }: { data: { name: string; value: number; color: string }[] }) => (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={38} outerRadius={58} dataKey="value">
          {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )}
}), { ssr: false, loading: () => <div style={{ height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9C9CA3' }}>Loading chart...</div> })

const PLATFORMS = ['Instagram', 'TikTok', 'YouTube', 'Twitter/X', 'LinkedIn']
const CONTENT_TYPES = ['Reels/Short Video', 'Stories', 'Static Post', 'YouTube Video', 'TikTok', 'Blog Post', 'Live Stream']
const OBJECTIVES = ['Brand Awareness', 'Product Launch', 'Sales & Conversions', 'App Downloads', 'Event Promotion', 'Content Library']

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem 1rem',
  border: '1.5px solid #DADADE',
  borderRadius: 8,
  fontSize: '0.95rem',
  color: '#1F1F21',
  background: '#F6F7F9',
  boxSizing: 'border-box',
  outline: 'none',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontWeight: 600,
  fontSize: '0.875rem',
  color: '#1F1F21',
  marginBottom: 6,
}

const sectionStyle: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #DADADE',
  borderRadius: 16,
  padding: '1.75rem',
  marginBottom: '1.5rem',
  boxShadow: '0 2px 8px rgba(28,21,73,0.04)',
}

export default function NewCampaignPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [name, setName] = useState('')
  const [objective, setObjective] = useState('')
  const [budget, setBudget] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [platforms, setPlatforms] = useState<string[]>([])
  const [contentTypes, setContentTypes] = useState<string[]>([])
  const [briefSummary, setBriefSummary] = useState('')
  const [keyMessages, setKeyMessages] = useState('')
  const [hashtags, setHashtags] = useState('')
  const [cta, setCta] = useState('')
  const [minFollowers, setMinFollowers] = useState('')
  const [maxBudgetPerCreator, setMaxBudgetPerCreator] = useState('')

  const toggle = (arr: string[], val: string, setter: (v: string[]) => void) => {
    setter(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val])
  }

  const budgetNum = parseFloat(budget) || 0
  const budgetData = [
    { name: 'Creators', value: budgetNum * 0.7, color: '#FF6117' },
    { name: 'Content', value: budgetNum * 0.2, color: '#5240CC' },
    { name: 'Misc', value: budgetNum * 0.1, color: '#2AE5B0' },
  ]

  const handleSubmit = async () => {
    if (!name) { toast.error('Campaign name is required'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/campaigns/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          objective: objective || 'Brand Awareness',
          budget_total: budgetNum || 10000,
          platforms: platforms.length ? platforms : ['Instagram'],
          content_types: contentTypes.length ? contentTypes : ['Reels/Short Video'],
          timeline_start: startDate || null,
          timeline_end: endDate || null,
          brief_summary: briefSummary || `Campaign for ${name}`,
          key_messages: keyMessages ? keyMessages.split('\n').filter(Boolean) : [],
          hashtags: hashtags ? hashtags.split(',').map(h => h.trim().replace('#', '')).filter(Boolean) : [],
          cta: cta || '',
          min_followers: parseInt(minFollowers) || 10000,
          max_budget_per_creator: parseInt(maxBudgetPerCreator) || 2000,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to generate campaign')
      toast.success('Campaign generated!')
      if (data.campaign_id) {
        router.push(`/campaigns/${data.campaign_id}`)
      } else {
        // Show results inline if no campaign ID
        toast.success('Campaign package ready!')
        setLoading(false)
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Failed to create campaign')
      setLoading(false)
    }
  }

  const btnActive: React.CSSProperties = { background: '#FF6117', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: 8, fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600, transition: 'all 0.15s' }
  const btnInactive: React.CSSProperties = { background: '#F6F7F9', color: '#505057', border: '1.5px solid #DADADE', padding: '0.5rem 1rem', borderRadius: 8, fontSize: '0.85rem', cursor: 'pointer', fontWeight: 500, transition: 'all 0.15s' }

  return (
    <div style={{ minHeight: '100vh', background: '#F6F7F9' }}>
      <Nav />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1C1549', marginBottom: 4 }}>New campaign</h1>
          <p style={{ color: '#7B7B84', fontSize: '0.95rem' }}>Fill in the details and let AI do the heavy lifting</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start' }}>
          {/* Main form */}
          <div>
            {/* Campaign basics */}
            <div style={sectionStyle}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1C1549', marginBottom: '1.25rem' }}>Campaign basics</h2>
              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Campaign name *</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Summer Beauty Launch 2024" style={inputStyle} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Campaign objective</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {OBJECTIVES.map(obj => (
                    <button type="button" key={obj} onClick={() => setObjective(obj)} style={objective === obj ? btnActive : btnInactive}>{obj}</button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Total budget ($)</label>
                  <input value={budget} onChange={e => setBudget(e.target.value)} type="number" placeholder="10000" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Max per creator ($)</label>
                  <input value={maxBudgetPerCreator} onChange={e => setMaxBudgetPerCreator(e.target.value)} type="number" placeholder="2000" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Start date</label>
                  <input value={startDate} onChange={e => setStartDate(e.target.value)} type="date" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>End date</label>
                  <input value={endDate} onChange={e => setEndDate(e.target.value)} type="date" style={inputStyle} />
                </div>
              </div>
            </div>

            {/* Platforms & content */}
            <div style={sectionStyle}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1C1549', marginBottom: '1.25rem' }}>Platforms & content</h2>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={labelStyle}>Platforms</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {PLATFORMS.map(p => (
                    <button type="button" key={p} onClick={() => toggle(platforms, p, setPlatforms)} style={platforms.includes(p) ? btnActive : btnInactive}>{p}</button>
                  ))}
                </div>
              </div>
              <div>
                <label style={labelStyle}>Content types</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {CONTENT_TYPES.map(ct => (
                    <button type="button" key={ct} onClick={() => toggle(contentTypes, ct, setContentTypes)} style={contentTypes.includes(ct) ? btnActive : btnInactive}>{ct}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Campaign brief */}
            <div style={sectionStyle}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1C1549', marginBottom: '1.25rem' }}>Campaign brief</h2>
              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Brief summary</label>
                <textarea value={briefSummary} onChange={e => setBriefSummary(e.target.value)}
                  placeholder="Describe your campaign goals, product, and what you want creators to convey..."
                  rows={4}
                  style={{ ...inputStyle, resize: 'vertical', minHeight: 120 }} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Key messages (one per line)</label>
                <textarea value={keyMessages} onChange={e => setKeyMessages(e.target.value)}
                  placeholder={'Our product solves X\nKey benefit: Y\nUnique differentiator: Z'}
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Hashtags</label>
                  <input value={hashtags} onChange={e => setHashtags(e.target.value)} placeholder="#brand, #campaign" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Call to action</label>
                  <input value={cta} onChange={e => setCta(e.target.value)} placeholder="Shop now at link in bio" style={inputStyle} />
                </div>
              </div>
            </div>

            {/* Creator preferences */}
            <div style={sectionStyle}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1C1549', marginBottom: '1.25rem' }}>Creator preferences</h2>
              <div>
                <label style={labelStyle}>Minimum followers</label>
                <input value={minFollowers} onChange={e => setMinFollowers(e.target.value)} type="number" placeholder="10000" style={{ ...inputStyle, maxWidth: 240 }} />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !name}
              style={{
                width: '100%',
                padding: '1rem',
                background: loading || !name ? '#FFD7C5' : '#FF6117',
                color: '#fff',
                border: 'none',
                borderRadius: 12,
                fontSize: '1.05rem',
                fontWeight: 700,
                cursor: loading || !name ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 20px rgba(255,97,23,0.35)',
                transition: 'background 0.15s',
              }}
            >
              {loading ? 'Generating campaign… (this may take 30s)' : 'Generate My Campaign →'}
            </button>
          </div>

          {/* Sidebar preview */}
          <div style={{ position: 'sticky', top: 88 }}>
            <div style={{ background: '#fff', border: '1px solid #DADADE', borderRadius: 16, padding: '1.75rem', boxShadow: '0 2px 8px rgba(28,21,73,0.04)' }}>
              <h3 style={{ fontWeight: 700, color: '#1C1549', marginBottom: '1.25rem', fontSize: '0.95rem' }}>Campaign preview</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '1.5rem' }}>
                {[
                  { label: 'Name', value: name || '—' },
                  { label: 'Objective', value: objective || '—' },
                  { label: 'Platforms', value: platforms.join(', ') || '—' },
                  ...(budget ? [{ label: 'Budget', value: `$${parseFloat(budget).toLocaleString()}` }] : []),
                ].map(item => (
                  <div key={item.label}>
                    <div style={{ color: '#9C9CA3', fontSize: '0.75rem', marginBottom: 2 }}>{item.label}</div>
                    <div style={{ color: '#1C1549', fontSize: '0.9rem', fontWeight: 500 }}>{item.value}</div>
                  </div>
                ))}
              </div>

              {budgetNum > 0 && (
                <div>
                  <div style={{ color: '#9C9CA3', fontSize: '0.75rem', marginBottom: 12 }}>Budget allocation</div>
                  <div style={{ height: 140 }}>
                    <RechartsWrapper data={budgetData} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {budgetData.map(item => (
                      <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }} />
                          <span style={{ color: '#7B7B84', fontSize: '0.8rem' }}>{item.name}</span>
                        </div>
                        <span style={{ color: '#1C1549', fontSize: '0.8rem', fontWeight: 600 }}>${item.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!budgetNum && (
                <div style={{ background: '#F6F5FF', border: '1px solid #D2CDF3', borderRadius: 10, padding: '1rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>🤖</div>
                  <p style={{ color: '#5240CC', fontSize: '0.8rem', lineHeight: 1.5 }}>
                    AI will find the best creators, score their fit, and write personalized outreach for you.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
