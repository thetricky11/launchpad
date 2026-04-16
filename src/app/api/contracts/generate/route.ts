import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServiceClient, createSupabaseServerClient } from '@/lib/supabase'
import { generateContract } from '@/lib/anthropic'

export async function POST(req: NextRequest) {
  try {
    const serverClient = await createSupabaseServerClient()
    const { data: { user } } = await serverClient.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { campaignCreatorId, campaignId, brandId } = await req.json()
    const supabase = createSupabaseServiceClient()

    const [{ data: cc }, { data: campaign }, { data: brand }] = await Promise.all([
      supabase.from('campaign_creators').select('*, creator:creators(*)').eq('id', campaignCreatorId).single(),
      supabase.from('campaigns').select('*').eq('id', campaignId).single(),
      supabase.from('brands').select('*').eq('id', brandId).single(),
    ])

    if (!cc || !campaign || !brand) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const contract = await generateContract(
      brand as unknown as Record<string, unknown>,
      cc.creator as unknown as Record<string, unknown>,
      campaign as unknown as Record<string, unknown>,
      {
        proposed_rate: cc.proposed_rate,
        agreed_rate: cc.agreed_rate,
        deliverables: cc.deliverables,
        start_date: campaign.timeline_start,
        end_date: campaign.timeline_end,
        platforms: campaign.platforms,
      }
    )

    return NextResponse.json(contract)
  } catch (err: unknown) {
    console.error('Contract generation error:', err)
    // Return a fallback template
    return NextResponse.json({
      contract_text: `INFLUENCER COLLABORATION AGREEMENT
      
⚠️ TEMPLATE ONLY - NOT LEGAL ADVICE

This agreement is between the Brand and Creator for the purposes of the influencer marketing campaign.

PARTIES:
- Brand: [Brand Name]
- Creator: [Creator Handle]

SCOPE OF WORK:
- Create and publish sponsored content as agreed
- Include required disclosures (#ad, #sponsored)
- Follow campaign brief guidelines

COMPENSATION:
- Rate as agreed in writing

TIMELINE:
- Content to be published as per campaign schedule

CONTENT RIGHTS:
- Brand receives license to repurpose content for 12 months

DISCLOSURE:
- Creator must disclose all paid partnerships per FTC guidelines

This is a template for reference only. Consult a legal professional for binding agreements.`
    })
  }
}
