import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'
import { scoreCampaignCreators } from '@/lib/anthropic'
import { scoreCreatorForCampaign } from '@/lib/scoring'
import type { Campaign, Creator } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { campaign, creators } = await req.json()

    try {
      const scores = await scoreCampaignCreators(campaign, creators)
      return NextResponse.json({ scores })
    } catch {
      // Fallback to local scoring
      const scores = creators.map((creator: Creator) => ({
        creator_id: creator.id,
        ...scoreCreatorForCampaign(creator, campaign as Campaign),
      }))
      return NextResponse.json({ scores })
    }
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
