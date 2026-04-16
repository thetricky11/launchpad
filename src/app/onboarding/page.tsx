'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createSupabaseBrowserClient } from '@/lib/supabase'

const INDUSTRIES = ['Fashion & Beauty', 'Food & Beverage', 'Technology', 'Health & Fitness', 'Travel', 'Gaming', 'Lifestyle', 'Entertainment', 'Education', 'Other']
const TONES = ['Professional', 'Casual & Friendly', 'Inspirational', 'Humorous', 'Luxurious', 'Educational', 'Bold & Edgy']
const INTERESTS = ['Beauty', 'Fashion', 'Food', 'Travel', 'Fitness', 'Tech', 'Gaming', 'Lifestyle', 'Parenting', 'Sustainability']
const VALUES = ['Quality', 'Innovation', 'Sustainability', 'Authenticity', 'Inclusivity', 'Community', 'Wellness', 'Fun', 'Trust', 'Creativity']

const LogoIcon = () => (
  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 32, height: 32 }}>
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

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const [brandName, setBrandName] = useState('')
  const [website, setWebsite] = useState('')
  const [industry, setIndustry] = useState('')
  const [ageRange, setAgeRange] = useState<string[]>([])
  const [gender, setGender] = useState<string[]>([])
  const [locations, setLocations] = useState('')
  const [interests, setInterests] = useState<string[]>([])
  const [toneOfVoice, setToneOfVoice] = useState('')
  const [brandValues, setBrandValues] = useState<string[]>([])
  const [competitors, setCompetitors] = useState('')

  const toggle = (arr: string[], val: string, setter: (v: string[]) => void) => {
    setter(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val])
  }

  const handleFinish = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')
      const { error } = await supabase.from('brands').insert({
        user_id: user.id,
        name: brandName,
        website: website || null,
        industry: industry || null,
        tone_of_voice: toneOfVoice || null,
        brand_values: brandValues.length ? brandValues : null,
        competitor_brands: competitors ? competitors.split(',').map(c => c.trim()).filter(Boolean) : null,
        target_audience: {
          age_range: ageRange,
          gender,
          locations: locations ? locations.split(',').map(l => l.trim()).filter(Boolean) : [],
          interests,
        },
        plan: 'free',
      })
      if (error) throw error
      toast.success('Brand profile created!')
      router.push('/dashboard')
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { num: 1, label: 'Company' },
    { num: 2, label: 'Audience' },
    { num: 3, label: 'Brand Identity' },
    { num: 4, label: 'Confirm' },
  ]

  const btnActive: React.CSSProperties = { background: '#FF6117', color: '#fff', border: 'none', padding: '0.65rem 1rem', borderRadius: 8, fontSize: '0.875rem', cursor: 'pointer', fontWeight: 600, transition: 'background 0.15s' }
  const btnInactive: React.CSSProperties = { background: '#F6F7F9', color: '#505057', border: '1.5px solid #DADADE', padding: '0.65rem 1rem', borderRadius: 8, fontSize: '0.875rem', cursor: 'pointer', fontWeight: 500 }

  return (
    <div style={{ minHeight: '100vh', background: '#F6F7F9', display: 'flex' }}>
      {/* Left sidebar */}
      <div style={{ width: 260, background: '#1C1549', display: 'flex', flexDirection: 'column', padding: '2.5rem 1.5rem', position: 'fixed', top: 0, left: 0, bottom: 0 }} className="hidden md:flex">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#FF7B3E', marginBottom: '3rem' }}>
          <LogoIcon />
          <div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: '1rem', lineHeight: 1.1 }}>LaunchPad</div>
            <div style={{ color: '#8E82E2', fontSize: '0.6rem', letterSpacing: '0.08em' }}>BY CREATORDB</div>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <p style={{ color: '#8E82E2', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', marginBottom: '1rem' }}>SETUP STEPS</p>
          {steps.map((s) => (
            <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1rem' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: step > s.num ? '#2AE5B0' : step === s.num ? '#FF6117' : 'rgba(255,255,255,0.08)',
                color: step >= s.num ? '#fff' : '#8E82E2',
                fontSize: '0.8rem', fontWeight: 700, flexShrink: 0,
                border: step === s.num ? '2px solid rgba(255,97,23,0.4)' : 'none',
              }}>
                {step > s.num ? '✓' : s.num}
              </div>
              <span style={{
                fontSize: '0.875rem',
                color: step === s.num ? '#fff' : step > s.num ? '#D2CDF3' : '#626269',
                fontWeight: step === s.num ? 600 : 400,
              }}>{s.label}</span>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid #261D64', paddingTop: '1.5rem' }}>
          <p style={{ color: '#505057', fontSize: '0.78rem', lineHeight: 1.5 }}>
            This info helps our AI find the perfect creators for your brand.
          </p>
        </div>
      </div>

      {/* Main area */}
      <div style={{ flex: 1, marginLeft: 0 }} className="md:ml-[260px]">
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '3rem 1.5rem' }}>
          {/* Mobile step header */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: '2rem' }} className="md:hidden">
            {steps.map((s) => (
              <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: step > s.num ? '#2AE5B0' : step === s.num ? '#FF6117' : '#DADADE',
                  color: step >= s.num ? '#fff' : '#7B7B84',
                  fontSize: '0.75rem', fontWeight: 700,
                }}>{step > s.num ? '✓' : s.num}</div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1C1549', marginBottom: 4 }}>Set up your brand</h1>
            <p style={{ color: '#7B7B84', fontSize: '0.95rem' }}>This helps us find the right creators for your campaigns</p>
          </div>

          <div style={{ background: '#fff', border: '1px solid #DADADE', borderRadius: 20, padding: '2.5rem', boxShadow: '0 2px 12px rgba(28,21,73,0.05)', marginBottom: '1.5rem' }}>
            {/* Step 1 */}
            {step === 1 && (
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1C1549', marginBottom: '1.5rem' }}>Company basics</h2>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', color: '#1F1F21', marginBottom: 6 }}>Brand name *</label>
                  <input value={brandName} onChange={e => setBrandName(e.target.value)} placeholder="Your brand name"
                    style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #DADADE', borderRadius: 8, fontSize: '0.95rem', color: '#1F1F21', background: '#F6F7F9', boxSizing: 'border-box', outline: 'none' }} />
                </div>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', color: '#1F1F21', marginBottom: 6 }}>Website</label>
                  <input value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://your-brand.com"
                    style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #DADADE', borderRadius: 8, fontSize: '0.95rem', color: '#1F1F21', background: '#F6F7F9', boxSizing: 'border-box', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', color: '#1F1F21', marginBottom: 10 }}>Industry</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {INDUSTRIES.map(ind => (
                      <button key={ind} onClick={() => setIndustry(ind)} style={industry === ind ? btnActive : btnInactive}>
                        {ind}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1C1549', marginBottom: '1.5rem' }}>Target audience</h2>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', color: '#1F1F21', marginBottom: 10 }}>Age range</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {['13-17', '18-24', '25-34', '35-44', '45+'].map(age => (
                      <button key={age} onClick={() => toggle(ageRange, age, setAgeRange)} style={ageRange.includes(age) ? btnActive : btnInactive}>{age}</button>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', color: '#1F1F21', marginBottom: 10 }}>Gender</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {['Female', 'Male', 'Non-binary', 'All'].map(g => (
                      <button key={g} onClick={() => toggle(gender, g, setGender)} style={gender.includes(g) ? btnActive : btnInactive}>{g}</button>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', color: '#1F1F21', marginBottom: 6 }}>Locations (comma-separated)</label>
                  <input value={locations} onChange={e => setLocations(e.target.value)} placeholder="US, UK, Australia"
                    style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #DADADE', borderRadius: 8, fontSize: '0.95rem', color: '#1F1F21', background: '#F6F7F9', boxSizing: 'border-box', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', color: '#1F1F21', marginBottom: 10 }}>Interests</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                    {INTERESTS.map(interest => (
                      <button key={interest} onClick={() => toggle(interests, interest, setInterests)} style={interests.includes(interest) ? btnActive : btnInactive}>{interest}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1C1549', marginBottom: '1.5rem' }}>Brand identity</h2>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', color: '#1F1F21', marginBottom: 10 }}>Tone of voice</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {TONES.map(tone => (
                      <button key={tone} onClick={() => setToneOfVoice(tone)} style={toneOfVoice === tone ? btnActive : btnInactive}>{tone}</button>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', color: '#1F1F21', marginBottom: 10 }}>Brand values</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                    {VALUES.map(val => (
                      <button key={val} onClick={() => toggle(brandValues, val, setBrandValues)} style={brandValues.includes(val) ? btnActive : btnInactive}>{val}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', color: '#1F1F21', marginBottom: 6 }}>Competitor brands (comma-separated)</label>
                  <input value={competitors} onChange={e => setCompetitors(e.target.value)} placeholder="Nike, Adidas, Lululemon"
                    style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #DADADE', borderRadius: 8, fontSize: '0.95rem', color: '#1F1F21', background: '#F6F7F9', boxSizing: 'border-box', outline: 'none' }} />
                </div>
              </div>
            )}

            {/* Step 4 */}
            {step === 4 && (
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1C1549', marginBottom: '1.5rem' }}>Confirm your profile</h2>
                <div>
                  {[
                    { label: 'Brand name', value: brandName },
                    { label: 'Website', value: website || '—' },
                    { label: 'Industry', value: industry || '—' },
                    { label: 'Target age', value: ageRange.join(', ') || '—' },
                    { label: 'Target gender', value: gender.join(', ') || '—' },
                    { label: 'Locations', value: locations || '—' },
                    { label: 'Interests', value: interests.join(', ') || '—' },
                    { label: 'Tone of voice', value: toneOfVoice || '—' },
                    { label: 'Brand values', value: brandValues.join(', ') || '—' },
                    { label: 'Competitors', value: competitors || '—' },
                  ].map((item, i) => (
                    <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '0.875rem 0', borderBottom: i < 9 ? '1px solid #ECECEE' : 'none' }}>
                      <span style={{ color: '#7B7B84', fontSize: '0.875rem' }}>{item.label}</span>
                      <span style={{ color: '#1C1549', fontSize: '0.875rem', fontWeight: 600, maxWidth: '60%', textAlign: 'right' }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {step > 1 ? (
              <button onClick={() => setStep(s => s - 1)} style={{ background: '#fff', color: '#1C1549', border: '1.5px solid #DADADE', padding: '0.75rem 1.5rem', borderRadius: 10, fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>
                ← Back
              </button>
            ) : <div />}

            {step < 4 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={step === 1 && !brandName}
                style={{ background: step === 1 && !brandName ? '#FFD7C5' : '#FF6117', color: '#fff', border: 'none', padding: '0.75rem 2rem', borderRadius: 10, fontSize: '0.9rem', fontWeight: 700, cursor: step === 1 && !brandName ? 'not-allowed' : 'pointer', boxShadow: '0 4px 16px rgba(255,97,23,0.3)' }}
              >
                Continue →
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={loading}
                style={{ background: loading ? '#FFB08B' : '#FF6117', color: '#fff', border: 'none', padding: '0.75rem 2rem', borderRadius: 10, fontSize: '0.9rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 16px rgba(255,97,23,0.3)' }}
              >
                {loading ? 'Saving…' : 'Launch LaunchPad 🚀'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
