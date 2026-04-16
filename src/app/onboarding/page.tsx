'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { createSupabaseBrowserClient } from '@/lib/supabase'

const INDUSTRIES = ['Fashion & Beauty', 'Food & Beverage', 'Technology', 'Health & Fitness', 'Travel', 'Gaming', 'Lifestyle', 'Entertainment', 'Education', 'Other']
const TONES = ['Professional', 'Casual & Friendly', 'Inspirational', 'Humorous', 'Luxurious', 'Educational', 'Bold & Edgy']
const INTERESTS = ['Beauty', 'Fashion', 'Food', 'Travel', 'Fitness', 'Tech', 'Gaming', 'Lifestyle', 'Parenting', 'Sustainability']
const VALUES = ['Quality', 'Innovation', 'Sustainability', 'Authenticity', 'Inclusivity', 'Community', 'Wellness', 'Fun', 'Trust', 'Creativity']

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

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Set up your brand</h1>
          <p className="text-zinc-400">This helps us find the right creators for your campaigns</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center gap-2">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-colors
                ${step > s.num ? 'bg-emerald-500 text-white' : step === s.num ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-500'}`}>
                {step > s.num ? '✓' : s.num}
              </div>
              <span className={`text-sm ${step === s.num ? 'text-white' : 'text-zinc-500'}`}>{s.label}</span>
              {i < steps.length - 1 && <div className="w-8 h-px bg-zinc-700 mx-2" />}
            </div>
          ))}
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          {/* Step 1: Company basics */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">Company basics</h2>
              <div className="space-y-2">
                <Label className="text-zinc-300">Brand name *</Label>
                <Input value={brandName} onChange={e => setBrandName(e.target.value)}
                  placeholder="Your brand name" className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500" />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Website</Label>
                <Input value={website} onChange={e => setWebsite(e.target.value)}
                  placeholder="https://your-brand.com" className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500" />
              </div>
              <div className="space-y-3">
                <Label className="text-zinc-300">Industry</Label>
                <div className="grid grid-cols-2 gap-2">
                  {INDUSTRIES.map(ind => (
                    <button key={ind} onClick={() => setIndustry(ind)}
                      className={`px-4 py-2 rounded-lg text-sm text-left transition-colors
                        ${industry === ind ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}>
                      {ind}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Target audience */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">Target audience</h2>
              <div className="space-y-3">
                <Label className="text-zinc-300">Age range</Label>
                <div className="flex flex-wrap gap-2">
                  {['13-17', '18-24', '25-34', '35-44', '45+'].map(age => (
                    <button key={age} onClick={() => toggle(ageRange, age, setAgeRange)}
                      className={`px-4 py-2 rounded-lg text-sm transition-colors
                        ${ageRange.includes(age) ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}>
                      {age}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-zinc-300">Gender</Label>
                <div className="flex flex-wrap gap-2">
                  {['Female', 'Male', 'Non-binary', 'All'].map(g => (
                    <button key={g} onClick={() => toggle(gender, g, setGender)}
                      className={`px-4 py-2 rounded-lg text-sm transition-colors
                        ${gender.includes(g) ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Locations (comma-separated)</Label>
                <Input value={locations} onChange={e => setLocations(e.target.value)}
                  placeholder="US, UK, Australia" className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500" />
              </div>
              <div className="space-y-3">
                <Label className="text-zinc-300">Interests</Label>
                <div className="grid grid-cols-3 gap-2">
                  {INTERESTS.map(interest => (
                    <button key={interest} onClick={() => toggle(interests, interest, setInterests)}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors
                        ${interests.includes(interest) ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}>
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Brand identity */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">Brand identity</h2>
              <div className="space-y-3">
                <Label className="text-zinc-300">Tone of voice</Label>
                <div className="grid grid-cols-2 gap-2">
                  {TONES.map(tone => (
                    <button key={tone} onClick={() => setToneOfVoice(tone)}
                      className={`px-4 py-2 rounded-lg text-sm text-left transition-colors
                        ${toneOfVoice === tone ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}>
                      {tone}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-zinc-300">Brand values</Label>
                <div className="grid grid-cols-3 gap-2">
                  {VALUES.map(val => (
                    <button key={val} onClick={() => toggle(brandValues, val, setBrandValues)}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors
                        ${brandValues.includes(val) ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}>
                      {val}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Competitor brands (comma-separated)</Label>
                <Input value={competitors} onChange={e => setCompetitors(e.target.value)}
                  placeholder="Nike, Adidas, Lululemon" className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500" />
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">Confirm your profile</h2>
              <div className="space-y-4">
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
                ].map(item => (
                  <div key={item.label} className="flex justify-between items-start py-3 border-b border-zinc-800">
                    <span className="text-zinc-400 text-sm">{item.label}</span>
                    <span className="text-white text-sm font-medium max-w-xs text-right">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          {step > 1 ? (
            <Button variant="outline" onClick={() => setStep(s => s - 1)} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
              ← Back
            </Button>
          ) : <div />}
          
          {step < 4 ? (
            <Button onClick={() => setStep(s => s + 1)} disabled={step === 1 && !brandName}
              className="bg-indigo-600 hover:bg-indigo-500 text-white">
              Continue →
            </Button>
          ) : (
            <Button onClick={handleFinish} disabled={loading} className="bg-indigo-600 hover:bg-indigo-500 text-white">
              {loading ? 'Saving...' : 'Launch LaunchPad 🚀'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
