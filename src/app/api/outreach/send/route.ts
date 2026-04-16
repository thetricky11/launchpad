import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServiceClient, createSupabaseServerClient } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const serverClient = await createSupabaseServerClient()
    const { data: { user } } = await serverClient.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { campaignCreatorId } = await req.json()
    const supabase = createSupabaseServiceClient()

    const { data: cc } = await supabase
      .from('campaign_creators')
      .select('*, creator:creators(*), campaign:campaigns(name)')
      .eq('id', campaignCreatorId)
      .single()

    if (!cc) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (!cc.creator?.contact_email) return NextResponse.json({ error: 'No email address' }, { status: 400 })
    if (!cc.outreach_email_body) return NextResponse.json({ error: 'No email body' }, { status: 400 })

    const { data, error } = await resend.emails.send({
      from: 'LaunchPad <onboarding@resend.dev>',
      to: cc.creator.contact_email,
      subject: cc.outreach_email_subject || `Collaboration opportunity — ${(cc.campaign as { name: string })?.name}`,
      html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        ${cc.outreach_email_body.replace(/\n/g, '<br>')}
      </div>`,
    })

    if (error) throw new Error(error.message)

    await supabase.from('campaign_creators').update({
      outreach_sent_at: new Date().toISOString(),
      status: 'contacted',
    }).eq('id', campaignCreatorId)

    return NextResponse.json({ success: true, messageId: data?.id })
  } catch (err: unknown) {
    console.error('Send outreach error:', err)
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
