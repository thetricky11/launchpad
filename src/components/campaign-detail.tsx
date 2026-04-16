'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import type { Campaign, Brand, CampaignCreator, Post } from '@/types'
import { createSupabaseBrowserClient } from '@/lib/supabase'

interface Props {
  campaign: Campaign
  brand: Brand | null
  campaignCreators: CampaignCreator[]
  posts: Post[]
}

const STATUS_COLORS: Record<string, string> = {
  shortlisted: 'bg-[#CFCFD3] text-[#505057]',
  contacted: 'bg-[#EDEAFF] text-[#5240CC]',
  negotiating: 'bg-amber-50 text-amber-600',
  confirmed: 'bg-emerald-50 text-emerald-600',
  declined: 'bg-red-50 text-red-600',
  completed: 'bg-[#FFF6F2] text-[#FF6117]',
}

export function CampaignDetail({ campaign, brand, campaignCreators, posts }: Props) {
  const supabase = createSupabaseBrowserClient()
  const [selectedCC, setSelectedCC] = useState<CampaignCreator | null>(null)
  const [outreachOpen, setOutreachOpen] = useState(false)
  const [editBody, setEditBody] = useState('')
  const [editSubject, setEditSubject] = useState('')
  const [contractOpen, setContractOpen] = useState(false)
  const [contractText, setContractText] = useState('')
  const [contractLoading, setContractLoading] = useState(false)
  const [sendingId, setSendingId] = useState<string | null>(null)

  const totalReach = campaignCreators.reduce((sum, cc) => sum + (cc.creator?.follower_count || 0), 0)
  const avgScore = campaignCreators.length > 0 
    ? Math.round(campaignCreators.reduce((sum, cc) => sum + (cc.fit_score || 0), 0) / campaignCreators.length)
    : 0
  const confirmedCount = campaignCreators.filter(cc => cc.status === 'confirmed').length
  const totalLikes = posts.reduce((sum, p) => sum + (p.likes || 0), 0)
  const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0)

  const budgetData = [
    { name: 'Used', value: (campaign.budget_total || 0) - (campaign.budget_remaining || campaign.budget_total || 0), color: '#FF6117' },
    { name: 'Remaining', value: campaign.budget_remaining || campaign.budget_total || 0, color: '#D2CDF3' },
  ]

  const openOutreach = (cc: CampaignCreator) => {
    setSelectedCC(cc)
    setEditSubject(cc.outreach_email_subject || '')
    setEditBody(cc.outreach_email_body || '')
    setOutreachOpen(true)
  }

  const saveOutreach = async () => {
    if (!selectedCC) return
    await supabase.from('campaign_creators').update({
      outreach_email_subject: editSubject,
      outreach_email_body: editBody,
    }).eq('id', selectedCC.id)
    setOutreachOpen(false)
    toast.success('Email saved')
  }

  const sendOutreach = async (cc: CampaignCreator) => {
    if (!cc.creator?.contact_email) { toast.error('No email address'); return }
    setSendingId(cc.id)
    try {
      const res = await fetch('/api/outreach/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignCreatorId: cc.id }),
      })
      if (!res.ok) throw new Error('Send failed')
      toast.success(`Outreach sent to ${cc.creator.handle}`)
    } catch {
      toast.error('Failed to send')
    } finally {
      setSendingId(null)
    }
  }

  const generateContract = async (cc: CampaignCreator) => {
    if (!cc.creator) return
    setSelectedCC(cc)
    setContractLoading(true)
    setContractOpen(true)
    try {
      const res = await fetch('/api/contracts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignCreatorId: cc.id, campaignId: campaign.id, brandId: campaign.brand_id }),
      })
      const data = await res.json()
      setContractText(data.contract_text || 'Contract generation failed')
    } catch {
      setContractText('Failed to generate contract. Please try again.')
    } finally {
      setContractLoading(false)
    }
  }

  const downloadContract = () => {
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF()
      const lines = doc.splitTextToSize(contractText, 180)
      doc.text(lines, 15, 20)
      doc.save(`contract-${selectedCC?.creator?.handle || 'creator'}.pdf`)
    })
  }

  const exportCSV = () => {
    const rows = posts.map(p => {
      const cc = campaignCreators.find(c => c.id === p.campaign_creator_id)
      return [cc?.creator?.handle || '', p.platform || '', p.likes, p.comments, p.views, p.link_clicks, p.conversions].join(',')
    })
    const csv = ['handle,platform,likes,comments,views,clicks,conversions', ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `campaign-${campaign.id}-report.csv`; a.click()
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1C1549]">{campaign.name}</h1>
          <p className="text-[#7B7B84] mt-1">{campaign.objective || 'No objective'}</p>
        </div>
        <span className={`text-sm px-3 py-1 rounded-full w-fit ${STATUS_COLORS[campaign.status] || STATUS_COLORS.shortlisted}`}>
          {campaign.status}
        </span>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Reach', value: totalReach > 0 ? `${(totalReach / 1000).toFixed(1)}K` : '—' },
          { label: 'Avg Fit Score', value: avgScore > 0 ? `${avgScore}/100` : '—' },
          { label: 'Confirmed Creators', value: confirmedCount },
          { label: 'Budget', value: campaign.budget_total ? `$${campaign.budget_total.toLocaleString()}` : '—' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-[#DADADE] rounded-xl p-4">
            <div className="text-2xl font-bold text-[#1C1549]">{s.value}</div>
            <div className="text-[#7B7B84] text-sm mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="bg-white border border-[#DADADE] mb-6">
          <TabsTrigger value="overview" className="data-[state=active]:bg-[#FF6117] data-[state=active]:text-white">Overview</TabsTrigger>
          <TabsTrigger value="creators" className="data-[state=active]:bg-[#FF6117] data-[state=active]:text-white">
            Creators ({campaignCreators.length})
          </TabsTrigger>
          <TabsTrigger value="outreach" className="data-[state=active]:bg-[#FF6117] data-[state=active]:text-white">Outreach</TabsTrigger>
          <TabsTrigger value="tracking" className="data-[state=active]:bg-[#FF6117] data-[state=active]:text-white">Tracking</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* AI Strategy */}
              {campaign.ai_generated_brief?.strategy && (
                <div className="bg-white border border-[#DADADE] rounded-2xl p-6">
                  <h3 className="font-semibold text-[#1C1549] mb-3">🤖 AI Strategy</h3>
                  <p className="text-[#505057] leading-relaxed">{campaign.ai_generated_brief.strategy}</p>
                </div>
              )}

              {/* Creator Bundle */}
              {campaign.ai_generated_brief?.bundle && (
                <div className="bg-white border border-[#DADADE] rounded-2xl p-6">
                  <h3 className="font-semibold text-[#1C1549] mb-3">📦 Creator Bundle</h3>
                  <p className="text-[#505057]">{campaign.ai_generated_brief.bundle}</p>
                </div>
              )}

              {/* Content brief */}
              {(campaign.brief_summary || campaign.key_messages?.length) && (
                <div className="bg-white border border-[#DADADE] rounded-2xl p-6">
                  <h3 className="font-semibold text-[#1C1549] mb-4">📋 Content Brief</h3>
                  {campaign.brief_summary && (
                    <p className="text-[#505057] mb-4 leading-relaxed">{campaign.brief_summary}</p>
                  )}
                  {campaign.key_messages && campaign.key_messages.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-[#7B7B84] text-sm mb-2">Key Messages</h4>
                      <ul className="space-y-1">
                        {campaign.key_messages.map((msg, i) => (
                          <li key={i} className="text-[#505057] text-sm flex gap-2">
                            <span className="text-[#FF6117]">→</span> {msg}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    {campaign.dos && campaign.dos.length > 0 && (
                      <div>
                        <h4 className="text-emerald-400 text-sm mb-2">✅ Do's</h4>
                        <ul className="space-y-1">
                          {campaign.dos.map((d, i) => (
                            <li key={i} className="text-[#505057] text-xs">{d}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {campaign.donts && campaign.donts.length > 0 && (
                      <div>
                        <h4 className="text-rose-400 text-sm mb-2">❌ Don'ts</h4>
                        <ul className="space-y-1">
                          {campaign.donts.map((d, i) => (
                            <li key={i} className="text-[#505057] text-xs">{d}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Posting schedule */}
              {campaign.ai_generated_brief?.posting_schedule && campaign.ai_generated_brief.posting_schedule.length > 0 && (
                <div className="bg-white border border-[#DADADE] rounded-2xl p-6">
                  <h3 className="font-semibold text-[#1C1549] mb-4">📅 Posting Schedule</h3>
                  <div className="space-y-2">
                    {campaign.ai_generated_brief.posting_schedule.map((item, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 bg-[#ECECEE] rounded-lg text-sm">
                        <span className="text-[#7B7B84] w-16">Week {item.week}</span>
                        <span className="text-[#FF6117]">{item.platform}</span>
                        <span className="text-[#505057]">{item.content_type}</span>
                        <span className="text-[#9C9CA3] ml-auto">{item.creator_tier}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Budget donut */}
            <div className="space-y-6">
              {campaign.budget_total && (
                <div className="bg-white border border-[#DADADE] rounded-2xl p-6">
                  <h3 className="font-semibold text-[#1C1549] mb-4">💰 Budget</h3>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={budgetData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value">
                          {budgetData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 mt-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#7B7B84]">Total</span>
                      <span className="text-[#1C1549]">${(campaign.budget_total || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#7B7B84]">Remaining</span>
                      <span className="text-emerald-400">${(campaign.budget_remaining || campaign.budget_total || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Hashtags */}
              {campaign.hashtags && campaign.hashtags.length > 0 && (
                <div className="bg-white border border-[#DADADE] rounded-2xl p-6">
                  <h3 className="font-semibold text-[#1C1549] mb-3">🏷️ Hashtags</h3>
                  <div className="flex flex-wrap gap-2">
                    {campaign.hashtags.map(tag => (
                      <span key={tag} className="bg-[#FFF6F2] text-[#FF7B3E] text-xs px-2 py-1 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* CREATORS TAB */}
        <TabsContent value="creators">
          {campaignCreators.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-xl font-semibold text-[#1C1549] mb-2">No creators yet</h3>
              <p className="text-[#7B7B84]">Creators will appear here after campaign generation</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {campaignCreators.map(cc => {
                const creator = cc.creator
                if (!creator) return null
                return (
                  <div key={cc.id} className="bg-white border border-[#DADADE] rounded-xl p-5">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-[#CFCFD3] flex items-center justify-center text-lg overflow-hidden flex-shrink-0">
                        {creator.avatar_url ? (
                          <img src={creator.avatar_url} alt={creator.handle} className="w-full h-full object-cover" />
                        ) : (
                          creator.handle.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-[#1C1549] truncate">@{creator.handle}</div>
                        <div className="text-[#7B7B84] text-sm">{creator.platform}</div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${STATUS_COLORS[cc.status]}`}>
                        {cc.status}
                      </span>
                    </div>

                    {cc.fit_score && (
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-[#7B7B84]">Fit Score</span>
                          <span className="text-[#1C1549] font-semibold">{Math.round(cc.fit_score)}/100</span>
                        </div>
                        <div className="h-2 bg-[#ECECEE] rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-[#FF6117] to-[#FF7B3E]"
                            style={{ width: `${cc.fit_score}%` }} />
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                      <div>
                        <div className="text-[#1C1549] text-sm font-semibold">
                          {creator.follower_count >= 1000000 ? `${(creator.follower_count / 1000000).toFixed(1)}M` :
                            creator.follower_count >= 1000 ? `${(creator.follower_count / 1000).toFixed(0)}K` :
                            creator.follower_count}
                        </div>
                        <div className="text-[#9C9CA3] text-xs">Followers</div>
                      </div>
                      <div>
                        <div className="text-[#1C1549] text-sm font-semibold">{creator.engagement_rate}%</div>
                        <div className="text-[#9C9CA3] text-xs">Engagement</div>
                      </div>
                      <div>
                        <div className="text-[#1C1549] text-sm font-semibold">{creator.brand_safety_score}</div>
                        <div className="text-[#9C9CA3] text-xs">Safety</div>
                      </div>
                    </div>

                    {cc.score_breakdown?.reasoning && (
                      <p className="text-[#7B7B84] text-xs mb-4 line-clamp-2">{cc.score_breakdown.reasoning}</p>
                    )}

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => openOutreach(cc)}
                        className="flex-1 border-[#DADADE] text-[#505057] hover:bg-[#ECECEE] text-xs">
                        View Email
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => generateContract(cc)}
                        className="flex-1 border-[#DADADE] text-[#505057] hover:bg-[#ECECEE] text-xs">
                        Contract
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </TabsContent>

        {/* OUTREACH TAB */}
        <TabsContent value="outreach">
          {campaignCreators.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">✉️</div>
              <h3 className="text-xl font-semibold text-[#1C1549] mb-2">No outreach yet</h3>
              <p className="text-[#7B7B84]">Outreach emails will be generated with your campaign</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#1C1549]">Outreach Emails</h3>
                <Button size="sm" onClick={() => {
                  Promise.all(campaignCreators.filter(cc => !cc.outreach_sent_at).map(cc => sendOutreach(cc)))
                }} className="bg-[#FF6117] hover:bg-indigo-500 text-[#1C1549] text-xs">
                  Bulk Send All
                </Button>
              </div>
              <div className="bg-white border border-[#DADADE] rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#DADADE]">
                      <th className="text-left p-4 text-[#7B7B84] text-sm font-medium">Creator</th>
                      <th className="text-left p-4 text-[#7B7B84] text-sm font-medium">Subject</th>
                      <th className="text-left p-4 text-[#7B7B84] text-sm font-medium">Status</th>
                      <th className="text-left p-4 text-[#7B7B84] text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaignCreators.map(cc => (
                      <tr key={cc.id} className="border-b border-[#DADADE] hover:bg-[#ECECEE]/50 transition-colors">
                        <td className="p-4">
                          <div className="text-[#1C1549] text-sm font-medium">@{cc.creator?.handle || '—'}</div>
                          <div className="text-[#9C9CA3] text-xs">{cc.creator?.contact_email || 'No email'}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-[#505057] text-sm truncate max-w-xs">
                            {cc.outreach_email_subject || 'No subject yet'}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            cc.outreach_sent_at ? 'bg-emerald-500/20 text-emerald-400' :
                            cc.outreach_email_body ? 'bg-amber-500/20 text-amber-400' :
                            'bg-[#CFCFD3] text-[#7B7B84]'
                          }`}>
                            {cc.outreach_sent_at ? 'Sent' : cc.outreach_email_body ? 'Ready' : 'No email'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            {cc.outreach_email_body && (
                              <Button size="sm" variant="outline" onClick={() => openOutreach(cc)}
                                className="border-[#DADADE] text-[#505057] hover:bg-[#CFCFD3] text-xs h-7">
                                Edit
                              </Button>
                            )}
                            {!cc.outreach_sent_at && cc.outreach_email_body && cc.creator?.contact_email && (
                              <Button size="sm" onClick={() => sendOutreach(cc)}
                                disabled={sendingId === cc.id}
                                className="bg-[#FF6117] hover:bg-indigo-500 text-[#1C1549] text-xs h-7">
                                {sendingId === cc.id ? '...' : 'Send'}
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </TabsContent>

        {/* TRACKING TAB */}
        <TabsContent value="tracking">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-[#1C1549]">Performance Tracking</h3>
              <Button size="sm" variant="outline" onClick={exportCSV}
                className="border-[#DADADE] text-[#505057] hover:bg-[#ECECEE]">
                Export CSV
              </Button>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Views', value: totalViews.toLocaleString(), icon: '👁️' },
                { label: 'Total Likes', value: totalLikes.toLocaleString(), icon: '❤️' },
                { label: 'Total Posts', value: posts.length, icon: '📱' },
                { label: 'Est. ROI', value: campaign.ai_generated_brief?.estimated_roi || '—', icon: '📈' },
              ].map(m => (
                <div key={m.label} className="bg-white border border-[#DADADE] rounded-xl p-4">
                  <div className="text-2xl mb-2">{m.icon}</div>
                  <div className="text-2xl font-bold text-[#1C1549]">{m.value}</div>
                  <div className="text-[#7B7B84] text-sm mt-1">{m.label}</div>
                </div>
              ))}
            </div>

            {/* Chart */}
            {posts.length > 0 ? (
              <div className="bg-white border border-[#DADADE] rounded-2xl p-6">
                <h4 className="font-semibold text-[#1C1549] mb-4">Cumulative Reach</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={posts.map((p, i) => ({ name: `Post ${i+1}`, views: p.views, likes: p.likes }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                      <XAxis dataKey="name" stroke="#71717a" />
                      <YAxis stroke="#71717a" />
                      <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: 8 }} />
                      <Legend />
                      <Line type="monotone" dataKey="views" stroke="#6366f1" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="likes" stroke="#10b981" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-white border border-[#DADADE] rounded-2xl">
                <div className="text-4xl mb-4">📊</div>
                <p className="text-[#7B7B84]">No post data yet. Stats will appear once creators publish content.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Outreach edit modal */}
      <Dialog open={outreachOpen} onOpenChange={setOutreachOpen}>
        <DialogContent className="bg-white border-[#DADADE] max-w-2xl text-[#1C1549]">
          <DialogHeader>
            <DialogTitle>Outreach Email — @{selectedCC?.creator?.handle}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-[#7B7B84] mb-1 block">Subject</label>
              <input value={editSubject} onChange={e => setEditSubject(e.target.value)}
                className="w-full bg-[#ECECEE] border border-[#DADADE] rounded-lg px-3 py-2 text-[#1C1549] text-sm" />
            </div>
            <div>
              <label className="text-sm text-[#7B7B84] mb-1 block">Body</label>
              <Textarea value={editBody} onChange={e => setEditBody(e.target.value)}
                className="bg-[#ECECEE] border-[#DADADE] text-[#1C1549] min-h-[200px] text-sm" />
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setOutreachOpen(false)} className="border-[#DADADE] text-[#505057]">Cancel</Button>
              <Button onClick={saveOutreach} className="bg-[#FF6117] hover:bg-indigo-500 text-[#1C1549]">Save</Button>
              {selectedCC?.creator?.contact_email && !selectedCC.outreach_sent_at && (
                <Button onClick={() => { saveOutreach(); sendOutreach(selectedCC!) }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-[#1C1549]">
                  Save & Send
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contract modal */}
      <Dialog open={contractOpen} onOpenChange={setContractOpen}>
        <DialogContent className="bg-white border-[#DADADE] max-w-2xl text-[#1C1549]">
          <DialogHeader>
            <DialogTitle>Contract — @{selectedCC?.creator?.handle}</DialogTitle>
          </DialogHeader>
          {contractLoading ? (
            <div className="text-center py-8 text-[#7B7B84]">Generating contract...</div>
          ) : (
            <div className="space-y-4">
              <div className="bg-[#ECECEE] rounded-lg p-4 max-h-80 overflow-y-auto">
                <pre className="text-[#505057] text-xs whitespace-pre-wrap font-mono">{contractText}</pre>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setContractOpen(false)} className="border-[#DADADE] text-[#505057]">Close</Button>
                <Button onClick={downloadContract} className="bg-[#FF6117] hover:bg-indigo-500 text-[#1C1549]">Download PDF</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  )
}
