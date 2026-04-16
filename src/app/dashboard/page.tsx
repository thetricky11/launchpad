import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase'
import { Nav } from '@/components/nav'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: brand } = await supabase.from('brands').select('*').eq('user_id', user.id).single()
  const { data: campaigns } = await supabase.from('campaigns').select('*').eq('brand_id', brand?.id || '').order('created_at', { ascending: false })
  
  const totalCampaigns = campaigns?.length || 0
  const activeCampaigns = campaigns?.filter(c => c.status === 'active').length || 0
  
  const statusColors: Record<string, string> = {
    draft: 'bg-zinc-700 text-zinc-300',
    active: 'bg-emerald-500/20 text-emerald-400',
    paused: 'bg-amber-500/20 text-amber-400',
    completed: 'bg-indigo-500/20 text-indigo-400',
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <Nav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
              {brand ? `Welcome back, ${brand.name}` : 'Welcome to LaunchPad'}
            </h1>
            <p className="text-zinc-400 mt-1">{brand?.industry || 'Set up your brand to get started'}</p>
          </div>
          <div className="flex gap-3">
            <Link href="/campaigns/new">
              <Button className="bg-indigo-600 hover:bg-indigo-500 text-white">
                + New Campaign
              </Button>
            </Link>
            <Link href="/billing">
              <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                Billing
              </Button>
            </Link>
          </div>
        </div>

        {/* No brand prompt */}
        {!brand && (
          <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-2xl p-8 mb-8 text-center">
            <h2 className="text-xl font-semibold text-white mb-2">Complete your setup</h2>
            <p className="text-zinc-400 mb-4">Set up your brand profile to start building campaigns</p>
            <Link href="/onboarding">
              <Button className="bg-indigo-600 hover:bg-indigo-500 text-white">Set up brand →</Button>
            </Link>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Campaigns', value: totalCampaigns, icon: '📊' },
            { label: 'Active Campaigns', value: activeCampaigns, icon: '🚀' },
            { label: 'Plan', value: brand?.plan?.charAt(0).toUpperCase() + (brand?.plan?.slice(1) || '') || 'Free', icon: '⭐' },
            { label: 'Status', value: 'Live', icon: '✅' },
          ].map(stat => (
            <div key={stat.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-zinc-400 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Campaigns */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Your Campaigns</h2>
          {!campaigns || campaigns.length === 0 ? (
            <div className="bg-zinc-900 border border-zinc-800 border-dashed rounded-2xl p-12 text-center">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-white mb-2">No campaigns yet</h3>
              <p className="text-zinc-400 mb-6">Create your first AI-powered influencer campaign</p>
              <Link href="/campaigns/new">
                <Button className="bg-indigo-600 hover:bg-indigo-500 text-white">Create campaign →</Button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {campaigns.map(campaign => (
                <Link key={campaign.id} href={`/campaigns/${campaign.id}`}>
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-600 transition-colors cursor-pointer h-full">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-white">{campaign.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${statusColors[campaign.status] || statusColors.draft}`}>
                        {campaign.status}
                      </span>
                    </div>
                    <p className="text-zinc-400 text-sm mb-4 line-clamp-2">{campaign.objective || 'No objective set'}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-500">
                        {campaign.budget_total ? `$${campaign.budget_total.toLocaleString()}` : 'No budget set'}
                      </span>
                      <span className="text-zinc-500">
                        {campaign.platforms?.slice(0, 2).join(', ') || 'All platforms'}
                      </span>
                    </div>
                    <div className="mt-3 text-xs text-zinc-600">
                      {new Date(campaign.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
