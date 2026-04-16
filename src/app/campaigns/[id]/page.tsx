import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase'
import { Nav } from '@/components/nav'
import { CampaignDetail } from '@/components/campaign-detail'

export default async function CampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: campaign } = await supabase.from('campaigns').select('*').eq('id', id).single()
  if (!campaign) redirect('/dashboard')

  const { data: brand } = await supabase.from('brands').select('*').eq('id', campaign.brand_id).single()
  
  const { data: campaignCreators } = await supabase
    .from('campaign_creators')
    .select('*, creator:creators(*)')
    .eq('campaign_id', id)
    .order('fit_score', { ascending: false })

  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .in('campaign_creator_id', (campaignCreators || []).map(cc => cc.id))

  return (
    <div className="min-h-screen bg-zinc-950">
      <Nav />
      <CampaignDetail
        campaign={campaign}
        brand={brand}
        campaignCreators={campaignCreators || []}
        posts={posts || []}
      />
    </div>
  )
}
