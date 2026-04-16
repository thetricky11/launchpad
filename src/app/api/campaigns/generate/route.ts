import { NextRequest, NextResponse } from 'next/server'
import { mockCreators } from '@/lib/mock-creators'
import { sortCreatorsByScore } from '@/lib/scoring'

export const maxDuration = 60

// In-memory campaign store (for demo — resets on restart)
const campaigns = new Map<string, Record<string, unknown>>()
export { campaigns }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, objective, budget_total, platforms, content_types, timeline_start, timeline_end, brief_summary, key_messages, hashtags, cta } = body

    if (!name) return NextResponse.json({ error: 'Campaign name required' }, { status: 400 })

    const campaignId = crypto.randomUUID()

    // 1. Filter mock creators by platform
    let creators = [...mockCreators]
    if (platforms?.length) {
      const platformLower = platforms.map((p: string) => p.toLowerCase())
      const filtered = creators.filter(c => platformLower.some((p: string) => c.platform.toLowerCase().includes(p)))
      if (filtered.length > 0) creators = filtered
    }

    // 2. Score creators using fallback scoring
    const campaign = { name, objective, budget_total, platforms, content_types, brief_summary, key_messages, hashtags, cta }
    const scored = sortCreatorsByScore(creators.slice(0, 30), campaign as any)
    scored.sort((a, b) => (b.score?.overall || 0) - (a.score?.overall || 0))
    const top10 = scored.slice(0, 10)

    // 3. Try Claude for enhanced scoring + brief
    let aiBrief: Record<string, unknown> = {}
    try {
      const { scoreCampaignCreators, generateCampaignBrief, generateOutreachEmail } = await import('@/lib/anthropic')
      
      // Score with Claude
      try {
        const claudeScores = await scoreCampaignCreators(
          campaign as any,
          top10.map(c => ({
            id: c.id, handle: c.handle, platform: c.platform,
            follower_count: c.follower_count, engagement_rate: c.engagement_rate,
            categories: c.categories, bio: c.bio, brand_safety_score: c.brand_safety_score,
            audience_demographics: c.audience_demographics, past_brand_deals: c.past_brand_deals,
          }))
        )
        // Merge Claude scores
        for (const creator of top10) {
          const cs = claudeScores.find((s: any) => String(s.creator_id) === String(creator.id))
          if (cs) {
            (creator as any).score = {
              ...(creator as any).score,
              ...(cs.score_breakdown || {}),
              overall: Math.round(Number(cs.fit_score || (creator as any).score?.overall || 70)),
              recommendation: cs.recommendation_reason || '',
              red_flags: cs.red_flags || [],
            }
          }
        }
      } catch (e) { console.log('Claude scoring fallback:', (e as Error).message) }

      // Generate brief with Claude
      try {
        aiBrief = await generateCampaignBrief({}, campaign as any, top10 as any)
      } catch (e) { console.log('Claude brief fallback:', (e as Error).message) }

      // Generate outreach for top 3
      for (const creator of top10.slice(0, 3)) {
        try {
          const email = await generateOutreachEmail({ name: 'Brand' }, campaign as any, creator as any)
          ;(creator as any).outreach = email
        } catch { /* skip */ }
      }
    } catch (e) {
      console.log('Anthropic not available, using fallback:', (e as Error).message)
    }

    // Fallback brief if Claude didn't work
    if (!aiBrief.campaign_strategy) {
      const totalReach = top10.reduce((sum, c) => sum + (c.follower_count || 0), 0)
      aiBrief = {
        campaign_strategy: `Leverage ${top10.length} creators across ${(platforms || ['Instagram']).join(', ')} to drive ${objective || 'brand awareness'} through authentic content partnerships.`,
        recommended_bundle: {
          description: `${top10.filter(c => (c.follower_count || 0) > 100000).length} macro + ${top10.filter(c => (c.follower_count || 0) <= 100000).length} micro creators for optimal reach and engagement`,
          total_estimated_reach: totalReach,
          estimated_cpm: budget_total ? Math.round((budget_total / totalReach) * 1000 * 100) / 100 : 5,
          estimated_total_cost: budget_total || 10000,
        },
        content_brief: {
          hook_suggestions: ['Start with a personal story', 'Show the before/after', 'Ask a controversial question'],
          talking_points: key_messages || ['Product benefits', 'Personal experience', 'Call to action'],
          visual_direction: 'Bright, authentic, lifestyle-focused content',
          posting_window: 'Tuesday-Thursday, 10am-2pm local time',
        },
        budget_breakdown: {
          creator_fees: Math.round((budget_total || 10000) * 0.7),
          production: Math.round((budget_total || 10000) * 0.15),
          platform_boost: Math.round((budget_total || 10000) * 0.15),
        },
      }
    }

    // Save campaign in memory
    const fullCampaign = {
      id: campaignId,
      ...campaign,
      budget_total,
      timeline_start,
      timeline_end,
      status: 'active',
      ai_generated_brief: aiBrief,
      creators: top10.map(c => ({
        id: c.id,
        handle: c.handle,
        full_name: c.full_name,
        platform: c.platform,
        avatar_url: c.avatar_url,
        follower_count: c.follower_count,
        engagement_rate: c.engagement_rate,
        categories: c.categories,
        location: c.location,
        bio: c.bio,
        score: (c as any).score || { overall: 70 },
        outreach: (c as any).outreach || null,
        status: 'shortlisted',
        estimated_rate: c.estimated_rate_per_post,
      })),
      created_at: new Date().toISOString(),
    }

    campaigns.set(campaignId, fullCampaign)

    return NextResponse.json({
      success: true,
      campaign_id: campaignId,
      campaign: fullCampaign,
    })
  } catch (err: unknown) {
    console.error('Campaign generation error:', err)
    return NextResponse.json({ error: (err as Error).message || 'Generation failed' }, { status: 500 })
  }
}
