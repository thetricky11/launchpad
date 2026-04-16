'use client'

import { useState } from 'react'

const PLATFORMS = ['Instagram', 'TikTok', 'YouTube', 'Twitter/X', 'LinkedIn']
const CONTENT_TYPES = ['Reels/Short Video', 'Stories', 'Static Post', 'YouTube Video', 'Blog Post']
const OBJECTIVES = ['Brand Awareness', 'Product Launch', 'Sales & Conversions', 'App Downloads', 'Event Promotion']

export default function NewCampaignPage() {
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
  const [result, setResult] = useState<string | null>(null)

  const toggle = (arr: string[], val: string, setter: (v: string[]) => void) => {
    setter(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val])
  }

  const handleSubmit = async () => {
    if (!name) { alert('Campaign name is required'); return }
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/campaigns/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          objective: objective || 'Brand Awareness',
          budget_total: parseFloat(budget) || 10000,
          platforms: platforms.length ? platforms : ['Instagram'],
          content_types: contentTypes.length ? contentTypes : ['Reels/Short Video'],
          timeline_start: startDate || null,
          timeline_end: endDate || null,
          brief_summary: briefSummary || `Campaign for ${name}`,
          key_messages: keyMessages ? keyMessages.split('\n').filter(Boolean) : [],
          hashtags: hashtags ? hashtags.split(',').map((h: string) => h.trim()).filter(Boolean) : [],
          cta: cta || '',
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      setResult(JSON.stringify(data, null, 2))
      if (data.campaign_id) {
        window.location.href = `/campaigns/${data.campaign_id}`
      }
    } catch (err: unknown) {
      alert((err as Error).message || 'Failed')
    } finally {
      setLoading(false)
    }
  }

  const S = {
    page: { minHeight: '100vh', background: '#F6F7F9', fontFamily: 'Inter, sans-serif' } as React.CSSProperties,
    nav: { background: '#1C1549', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } as React.CSSProperties,
    main: { maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem' } as React.CSSProperties,
    section: { background: '#fff', border: '1px solid #DADADE', borderRadius: 16, padding: '1.75rem', marginBottom: '1.5rem' } as React.CSSProperties,
    label: { display: 'block', fontWeight: 600, fontSize: '0.875rem', color: '#1F1F21', marginBottom: 6 } as React.CSSProperties,
    input: { width: '100%', padding: '0.75rem', border: '1.5px solid #DADADE', borderRadius: 8, fontSize: '0.95rem', color: '#1F1F21', background: '#F6F7F9', boxSizing: 'border-box' as const, outline: 'none' } as React.CSSProperties,
    btnOn: { background: '#FF6117', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: 8, fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 } as React.CSSProperties,
    btnOff: { background: '#F6F7F9', color: '#505057', border: '1.5px solid #DADADE', padding: '0.5rem 1rem', borderRadius: 8, fontSize: '0.85rem', cursor: 'pointer', fontWeight: 500 } as React.CSSProperties,
  }

  return (
    <div style={S.page}>
      <nav style={S.nav}>
        <a href="/dashboard" style={{ color: '#fff', textDecoration: 'none', fontWeight: 800, fontSize: '1.1rem' }}>🚀 LaunchPad</a>
        <a href="/dashboard" style={{ color: '#FF7B3E', textDecoration: 'none', fontSize: '0.875rem' }}>← Back to dashboard</a>
      </nav>

      <main style={S.main}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1C1549', marginBottom: 4 }}>New campaign</h1>
        <p style={{ color: '#7B7B84', marginBottom: '2rem' }}>Fill in the details and let AI do the heavy lifting</p>

        {/* Campaign basics */}
        <div style={S.section}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1C1549', marginBottom: '1.25rem' }}>Campaign basics</h2>
          <div style={{ marginBottom: '1rem' }}>
            <label style={S.label}>Campaign name *</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Summer Beauty Launch 2024" style={S.input} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={S.label}>Campaign objective</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              {OBJECTIVES.map(obj => (
                <button type="button" key={obj} onClick={() => setObjective(objective === obj ? '' : obj)} style={objective === obj ? S.btnOn : S.btnOff}>
                  {obj}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={S.label}>Total budget ($)</label>
              <input value={budget} onChange={e => setBudget(e.target.value)} type="number" placeholder="10000" style={S.input} />
            </div>
            <div>
              <label style={S.label}>Timeline</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input value={startDate} onChange={e => setStartDate(e.target.value)} type="date" style={{ ...S.input, flex: 1 }} />
                <input value={endDate} onChange={e => setEndDate(e.target.value)} type="date" style={{ ...S.input, flex: 1 }} />
              </div>
            </div>
          </div>
        </div>

        {/* Platforms */}
        <div style={S.section}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1C1549', marginBottom: '1.25rem' }}>Platforms & content</h2>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={S.label}>Platforms</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {PLATFORMS.map(p => (
                <button type="button" key={p} onClick={() => toggle(platforms, p, setPlatforms)} style={platforms.includes(p) ? S.btnOn : S.btnOff}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={S.label}>Content types</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {CONTENT_TYPES.map(ct => (
                <button type="button" key={ct} onClick={() => toggle(contentTypes, ct, setContentTypes)} style={contentTypes.includes(ct) ? S.btnOn : S.btnOff}>
                  {ct}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Brief */}
        <div style={S.section}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1C1549', marginBottom: '1.25rem' }}>Campaign brief</h2>
          <div style={{ marginBottom: '1rem' }}>
            <label style={S.label}>Brief summary</label>
            <textarea value={briefSummary} onChange={e => setBriefSummary(e.target.value)} rows={4}
              placeholder="Describe your campaign goals, product, and what you want creators to convey..."
              style={{ ...S.input, resize: 'vertical' as const, minHeight: 100 }} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={S.label}>Key messages (one per line)</label>
            <textarea value={keyMessages} onChange={e => setKeyMessages(e.target.value)} rows={3}
              placeholder="Our product solves X&#10;Key benefit: Y" style={{ ...S.input, resize: 'vertical' as const, minHeight: 80 }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={S.label}>Hashtags</label>
              <input value={hashtags} onChange={e => setHashtags(e.target.value)} placeholder="#brand, #campaign" style={S.input} />
            </div>
            <div>
              <label style={S.label}>Call to action</label>
              <input value={cta} onChange={e => setCta(e.target.value)} placeholder="Shop now at link in bio" style={S.input} />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || !name}
          style={{
            width: '100%', padding: '1rem',
            background: loading || !name ? '#FFD7C5' : '#FF6117',
            color: '#fff', border: 'none', borderRadius: 12,
            fontSize: '1.05rem', fontWeight: 700,
            cursor: loading || !name ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 20px rgba(255,97,23,0.35)',
          }}
        >
          {loading ? '⏳ Generating campaign… (this may take 30 seconds)' : '🚀 Generate My Campaign →'}
        </button>

        {result && (
          <div style={{ ...S.section, marginTop: '1.5rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1C1549', marginBottom: '0.5rem' }}>Result</h2>
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.8rem', maxHeight: 400, overflow: 'auto' }}>{result}</pre>
          </div>
        )}
      </main>
    </div>
  )
}
