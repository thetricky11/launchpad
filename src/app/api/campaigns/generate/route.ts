import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServiceClient, createSupabaseServerClient } from '@/lib/supabase'
import { searchCreators } from '@/lib/creatordb'
import { scoreCampaignCreators, generateCampaignBrief, generateOutreachEmail } from '@/lib/anthropic'
import { sortCreatorsByScore } from '@/lib/scoring'
import type { Campaign } from '@/types'

export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const { campaignId } = await req.json()
    if (!campaignId) return NextResponse.json({ error: 'campaignId required' }, { status: 400 })

    const serverClient = await createSupabaseServerClient()
    const { data: { user } } = await serverClient.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = createSupabaseServiceClient()

    // Fetch campaign
    const { data: campaign } = await supabase.from('campaigns').select('*').eq('id', campaignId).single()
    if (!campaign) return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })

    // Fetch brand
    const { data: brand } = await supabase.from('brands').select('*').eq('id', campaign.brand_id).single()

    // 1. Search creators
    const filters = {
      platform: campaign.platforms || undefined,
      limit: 20,
    }
    const creators = await searchCreators(filters)

    // 2. Score creators
    let scoredCreators: Array<typeof creators[0] & { score: { overall: number; [k: string]: unknown } }> = []
    
    try {
      const claudeScores = await scoreCampaignCreators(
        campaign as unknown as Record<string, unknown>,
        creators.map(c => ({
          id: c.id,
          handle: c.handle,
          platform: c.platform,
          follower_count: c.follower_count,
          engagement_rate: c.engagement_rate,
          categories: c.categories,
          past_brand_deals: c.past_brand_deals,
          brand_safety_score: c.brand_safety_score,
          audience_demographics: c.audience_demographics,
          bio: c.bio,
        }))
      )
      
      scoredCreators = creators.map(creator => {
        const claudeScore = claudeScores.find(s => String(s.creator_id) === String(creator.id))
        const fallbackScore = sortCreatorsByScore([creator], campaign as unknown as Campaign)[0].score
        return {
          ...creator,
          score: {
            ...fallbackScore,
            ...(claudeScore?.score_breakdown as Record<string, unknown> || {}),
            overall: Math.round(Number(claudeScore?.fit_score || fallbackScore.overall)),
          }
        }
      })
    } catch {
      // Fallback to pure scoring
      scoredCreators = sortCreatorsByScore(creators, campaign as unknown as Campaign).map(c => ({
        ...c,
        score: { ...c.score, overall: c.score.overall }
      }))
    }

    scoredCreators.sort((a, b) => b.score.overall - a.score.overall)
    const top10 = scoredCreators.slice(0, 10)

    // 3. Generate campaign brief
    let aiBrief: Record<string, unknown> = {}
    try {
      aiBrief = await generateCampaignBrief(
        brand as unknown as Record<string, unknown> || {},
        campaign as unknown as Record<string, unknown>,
        top10 as unknown as Record<string, unknown>[]
      )
    } catch {
      aiBrief = {
        strategy: `Focus on authentic creator partnerships across ${(campaign.platforms || []).join(', ')} to drive ${campaign.objective || 'brand awareness'}.`,
        bundle: `Mix of micro-influencers (50K-200K) and macro-influencers (200K+) for optimal reach and engagement.`,
        estimated_reach: top10.reduce((sum, c) => sum + c.follower_count, 0),
        estimated_roi: '2.5:1',
      }
    }

    // 4. Upsert creators and create campaign_creators
    const creatorInserts = []
    const campaignCreatorInserts = []

    for (const creator of top10) {
      // Upsert creator
      const { data: existingCreator } = await supabase
        .from('creators')
        .select('id')
        .eq('id', creator.id)
        .single()

      let creatorId = creator.id
      if (!existingCreator) {
        const { data: inserted } = await supabase
          .from('creators')
          .upsert({
            id: creator.id,
            external_id: creator.external_id || creator.id,
            handle: creator.handle,
            full_name: creator.full_name,
            platform: creator.platform,
            profile_url: creator.profile_url,
            avatar_url: creator.avatar_url,
            bio: creator.bio,
            follower_count: creator.follower_count,
            engagement_rate: creator.engagement_rate,
            avg_likes: creator.avg_likes,
            avg_comments: creator.avg_comments,
            avg_views: creator.avg_views,
            audience_demographics: creator.audience_demographics,
            categories: creator.categories,
            past_brand_deals: creator.past_brand_deals,
            estimated_cpm: creator.estimated_cpm,
            estimated_rate_per_post: creator.estimated_rate_per_post,
            contact_email: creator.contact_email,
            location: creator.location,
            brand_safety_score: creator.brand_safety_score,
            fake_follower_percentage: creator.fake_follower_percentage,
          }, { onConflict: 'id' })
          .select('id')
          .single()
        if (inserted) creatorId = inserted.id
      }

      campaignCreatorInserts.push({
        campaign_id: campaignId,
        creator_id: creatorId,
        fit_score: creator.score.overall,
        score_breakdown: creator.score,
        status: 'shortlisted',
        proposed_rate: creator.estimated_rate_per_post,
      })
    }

    // Insert campaign creators
    if (campaignCreatorInserts.length > 0) {
      await supabase.from('campaign_creators').insert(campaignCreatorInserts)
    }

    // 5. Generate outreach emails for top 3
    const { data: insertedCCs } = await supabase
      .from('campaign_creators')
      .select('id, creator_id')
      .eq('campaign_id', campaignId)
      .order('fit_score', { ascending: false })
      .limit(3)

    if (insertedCCs) {
      for (const cc of insertedCCs) {
        const creator = top10.find(c => c.id === cc.creator_id)
        if (!creator) continue
        
        try {
          const email = await generateOutreachEmail(
            brand as unknown as Record<string, unknown> || { name: 'Brand' },
            campaign as unknown as Record<string, unknown>,
            creator as unknown as Record<string, unknown>
          )
          
          await supabase.from('campaign_creators').update({
            outreach_email_subject: email.subject,
            outreach_email_body: email.body,
          }).eq('id', cc.id)
        } catch {
          // Skip outreach generation on error
        }
      }
    }

    // 6. Update campaign with AI brief
    await supabase.from('campaigns').update({
      ai_generated_brief: aiBrief,
      key_messages: (aiBrief.key_messages as string[]) || campaign.key_messages,
      dos: (aiBrief.dos as string[]) || null,
      donts: (aiBrief.donts as string[]) || null,
      status: 'active',
    }).eq('id', campaignId)

    return NextResponse.json({ success: true, campaignId })
  } catch (err: unknown) {
    console.error('Campaign generation error:', err)
    return NextResponse.json({ error: (err as Error).message || 'Generation failed' }, { status: 500 })
  }
}
