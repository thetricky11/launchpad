import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServiceClient, createSupabaseServerClient } from '@/lib/supabase'
import { generateOutreachEmail } from '@/lib/anthropic'

export async function POST(req: NextRequest) {
  try {
    const serverClient = await createSupabaseServerClient()
    const { data: { user } } = await serverClient.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { campaignCreatorId } = await req.json()
    const supabase = createSupabaseServiceClient()

    const { data: cc } = await supabase
      .from('campaign_creators')
      .select('*, creator:creators(*), campaign:campaigns(*, brand:brands(*))')
      .eq('id', campaignCreatorId)
      .single()

    if (!cc) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const email = await generateOutreachEmail(
      (cc.campaign as Record<string, unknown> & { brand: Record<string, unknown> })?.brand || {},
      cc.campaign as Record<string, unknown>,
      cc.creator as Record<string, unknown>
    )

    await supabase.from('campaign_creators').update({
      outreach_email_subject: email.subject,
      outreach_email_body: email.body,
    }).eq('id', campaignCreatorId)

    return NextResponse.json(email)
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
