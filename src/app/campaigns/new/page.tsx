'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Nav } from '@/components/nav'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { createSupabaseBrowserClient } from '@/lib/supabase'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

const PLATFORMS = ['Instagram', 'TikTok', 'YouTube', 'Twitter/X', 'LinkedIn']
const CONTENT_TYPES = ['Reels/Short Video', 'Stories', 'Static Post', 'YouTube Video', 'TikTok', 'Blog Post', 'Live Stream']
const OBJECTIVES = ['Brand Awareness', 'Product Launch', 'Sales & Conversions', 'App Downloads', 'Event Promotion', 'Content Library']

export default function NewCampaignPage() {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()
  const [loading, setLoading] = useState(false)
  const [brandId, setBrandId] = useState<string | null>(null)

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

  useEffect(() => {
    const fetchBrand = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: brand } = await supabase.from('brands').select('id').eq('user_id', user.id).single()
      if (brand) setBrandId(brand.id)
    }
    fetchBrand()
  }, [])

  const toggle = (arr: string[], val: string, setter: (v: string[]) => void) => {
    setter(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val])
  }

  const budgetNum = parseFloat(budget) || 0
  const budgetData = [
    { name: 'Creators', value: budgetNum * 0.7, color: '#6366f1' },
    { name: 'Content', value: budgetNum * 0.2, color: '#10b981' },
    { name: 'Misc', value: budgetNum * 0.1, color: '#f59e0b' },
  ]

  const handleSubmit = async () => {
    if (!name || !brandId) { toast.error('Campaign name required'); return }
    setLoading(true)
    
    try {
      // Save campaign first
      const { data: campaign, error } = await supabase.from('campaigns').insert({
        brand_id: brandId,
        name,
        objective: objective || null,
        budget_total: budgetNum || null,
        budget_remaining: budgetNum || null,
        platforms: platforms.length ? platforms : null,
        content_types: contentTypes.length ? contentTypes : null,
        timeline_start: startDate || null,
        timeline_end: endDate || null,
        brief_summary: briefSummary || null,
        key_messages: keyMessages ? keyMessages.split('\n').filter(Boolean) : null,
        hashtags: hashtags ? hashtags.split(',').map(h => h.trim().replace('#', '')).filter(Boolean) : null,
        cta: cta || null,
        status: 'draft',
      }).select().single()

      if (error) throw error

      toast.success('Generating campaign...')
      router.push(`/campaigns/${campaign.id}/generating`)
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Failed to create campaign')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <Nav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">New Campaign</h1>
          <p className="text-zinc-400 mt-1">Fill in the details and let AI do the heavy lifting</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Campaign basics */}
            <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
              <h2 className="text-lg font-semibold text-white">Campaign basics</h2>
              <div className="space-y-2">
                <Label className="text-zinc-300">Campaign name *</Label>
                <Input value={name} onChange={e => setName(e.target.value)}
                  placeholder="Summer Beauty Launch 2024"
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500" />
              </div>
              <div className="space-y-3">
                <Label className="text-zinc-300">Campaign objective</Label>
                <div className="grid grid-cols-2 gap-2">
                  {OBJECTIVES.map(obj => (
                    <button key={obj} onClick={() => setObjective(obj)}
                      className={`px-4 py-2 rounded-lg text-sm text-left transition-colors
                        ${objective === obj ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}>
                      {obj}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Budget & timeline */}
            <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
              <h2 className="text-lg font-semibold text-white">Budget & timeline</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-zinc-300">Total budget ($)</Label>
                  <Input value={budget} onChange={e => setBudget(e.target.value)} type="number"
                    placeholder="10000" className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500" />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Max per creator ($)</Label>
                  <Input value={maxBudgetPerCreator} onChange={e => setMaxBudgetPerCreator(e.target.value)} type="number"
                    placeholder="2000" className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500" />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Start date</Label>
                  <Input value={startDate} onChange={e => setStartDate(e.target.value)} type="date"
                    className="bg-zinc-800 border-zinc-700 text-white" />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">End date</Label>
                  <Input value={endDate} onChange={e => setEndDate(e.target.value)} type="date"
                    className="bg-zinc-800 border-zinc-700 text-white" />
                </div>
              </div>
            </section>

            {/* Platforms & content */}
            <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
              <h2 className="text-lg font-semibold text-white">Platforms & content</h2>
              <div className="space-y-3">
                <Label className="text-zinc-300">Platforms</Label>
                <div className="flex flex-wrap gap-2">
                  {PLATFORMS.map(p => (
                    <button key={p} onClick={() => toggle(platforms, p, setPlatforms)}
                      className={`px-4 py-2 rounded-lg text-sm transition-colors
                        ${platforms.includes(p) ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-zinc-300">Content types</Label>
                <div className="flex flex-wrap gap-2">
                  {CONTENT_TYPES.map(ct => (
                    <button key={ct} onClick={() => toggle(contentTypes, ct, setContentTypes)}
                      className={`px-4 py-2 rounded-lg text-sm transition-colors
                        ${contentTypes.includes(ct) ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}>
                      {ct}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Campaign brief */}
            <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
              <h2 className="text-lg font-semibold text-white">Campaign brief</h2>
              <div className="space-y-2">
                <Label className="text-zinc-300">Brief summary</Label>
                <Textarea value={briefSummary} onChange={e => setBriefSummary(e.target.value)}
                  placeholder="Describe your campaign goals, product, and what you want creators to convey..."
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 min-h-[120px]" />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Key messages (one per line)</Label>
                <Textarea value={keyMessages} onChange={e => setKeyMessages(e.target.value)}
                  placeholder="Our product solves X&#10;Key benefit: Y&#10;Unique differentiator: Z"
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 min-h-[80px]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-zinc-300">Hashtags</Label>
                  <Input value={hashtags} onChange={e => setHashtags(e.target.value)}
                    placeholder="#brand, #campaign, #product"
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500" />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Call to action</Label>
                  <Input value={cta} onChange={e => setCta(e.target.value)}
                    placeholder="Shop now at link in bio"
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500" />
                </div>
              </div>
            </section>

            {/* Creator preferences */}
            <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
              <h2 className="text-lg font-semibold text-white">Creator preferences</h2>
              <div className="space-y-2">
                <Label className="text-zinc-300">Minimum followers</Label>
                <Input value={minFollowers} onChange={e => setMinFollowers(e.target.value)} type="number"
                  placeholder="10000" className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500" />
              </div>
            </section>

            <Button onClick={handleSubmit} disabled={loading || !name}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-6 text-lg rounded-xl">
              {loading ? 'Creating...' : 'Generate My Campaign →'}
            </Button>
          </div>

          {/* Sidebar preview */}
          <div className="space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sticky top-24">
              <h3 className="font-semibold text-white mb-4">Campaign Preview</h3>
              
              <div className="space-y-3 mb-6">
                <div>
                  <div className="text-zinc-500 text-xs mb-1">Name</div>
                  <div className="text-white text-sm">{name || '—'}</div>
                </div>
                <div>
                  <div className="text-zinc-500 text-xs mb-1">Objective</div>
                  <div className="text-white text-sm">{objective || '—'}</div>
                </div>
                <div>
                  <div className="text-zinc-500 text-xs mb-1">Platforms</div>
                  <div className="text-white text-sm">{platforms.join(', ') || '—'}</div>
                </div>
                {budget && (
                  <div>
                    <div className="text-zinc-500 text-xs mb-1">Budget</div>
                    <div className="text-white text-sm">${parseFloat(budget).toLocaleString()}</div>
                  </div>
                )}
              </div>

              {budgetNum > 0 && (
                <div>
                  <div className="text-zinc-500 text-xs mb-3">Budget allocation</div>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={budgetData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value">
                          {budgetData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2">
                    {budgetData.map(item => (
                      <div key={item.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-zinc-400">{item.name}</span>
                        </div>
                        <span className="text-white">${item.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
