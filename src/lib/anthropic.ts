import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function stripCodeFences(text: string): string {
  return text.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim()
}

async function callClaude(prompt: string, strict = false): Promise<string> {
  const systemPrompt = strict
    ? 'You are a JSON API. Respond ONLY with valid JSON. No markdown, no code fences, no explanation.'
    : 'You are a helpful AI assistant. When asked for JSON, respond with valid JSON only — no markdown, no code fences.'
  
  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: prompt }],
  })
  
  const content = message.content[0]
  if (content.type !== 'text') throw new Error('Unexpected content type')
  return content.text
}

async function parseJSON<T>(prompt: string): Promise<T> {
  try {
    const raw = await callClaude(prompt)
    const cleaned = stripCodeFences(raw)
    return JSON.parse(cleaned)
  } catch {
    // Retry once with strict prompt
    const raw = await callClaude(prompt, true)
    const cleaned = stripCodeFences(raw)
    return JSON.parse(cleaned)
  }
}

export async function scoreCampaignCreators(
  campaign: Record<string, unknown>,
  creators: Record<string, unknown>[]
): Promise<Record<string, unknown>[]> {
  const prompt = `Score each creator for this influencer campaign. Return a JSON array of scored creators.

Campaign:
${JSON.stringify(campaign, null, 2)}

Creators to score:
${JSON.stringify(creators, null, 2)}

For each creator, return:
{
  "creator_id": "string",
  "fit_score": number (0-100),
  "score_breakdown": {
    "audience_fit": number (0-100),
    "engagement_quality": number (0-100),
    "brand_safety": number (0-100),
    "content_alignment": number (0-100),
    "reach_value": number (0-100),
    "overall": number (0-100),
    "reasoning": "brief explanation"
  }
}

Return ONLY the JSON array, nothing else.`

  return parseJSON<Record<string, unknown>[]>(prompt)
}

export async function generateCampaignBrief(
  brand: Record<string, unknown>,
  campaign: Record<string, unknown>,
  creators: Record<string, unknown>[]
): Promise<Record<string, unknown>> {
  const prompt = `Generate a comprehensive influencer campaign brief as JSON.

Brand: ${JSON.stringify(brand, null, 2)}
Campaign: ${JSON.stringify(campaign, null, 2)}
Selected Creators: ${JSON.stringify(creators.slice(0, 5), null, 2)}

Return JSON with this structure:
{
  "strategy": "2-3 sentence overall campaign strategy",
  "bundle": "recommended creator bundle description",
  "content_angles": ["angle1", "angle2", "angle3"],
  "posting_schedule": [
    {"week": 1, "platform": "Instagram", "content_type": "Reel", "creator_tier": "Macro"}
  ],
  "estimated_reach": number,
  "estimated_impressions": number,
  "estimated_roi": "X:1 ROI estimate with reasoning",
  "key_messages": ["msg1", "msg2"],
  "dos": ["do1", "do2"],
  "donts": ["dont1", "dont2"]
}

Return ONLY the JSON object.`

  return parseJSON<Record<string, unknown>>(prompt)
}

export async function generateOutreachEmail(
  brand: Record<string, unknown>,
  campaign: Record<string, unknown>,
  creator: Record<string, unknown>
): Promise<{ subject: string; body: string }> {
  const prompt = `Write a personalized influencer outreach email for this campaign collaboration.

Brand: ${JSON.stringify(brand)}
Campaign: ${JSON.stringify(campaign)}
Creator: ${JSON.stringify(creator)}

Return JSON:
{
  "subject": "email subject line",
  "body": "full email body in plain text, personalized and compelling"
}

Keep it concise (150-200 words), friendly, and highlight mutual value. Return ONLY the JSON.`

  return parseJSON<{ subject: string; body: string }>(prompt)
}

export async function generateContract(
  brand: Record<string, unknown>,
  creator: Record<string, unknown>,
  campaign: Record<string, unknown>,
  terms: Record<string, unknown>
): Promise<{ contract_text: string }> {
  const prompt = `Generate an influencer marketing contract as plain text (not legal advice, clearly marked as a template).

Brand: ${JSON.stringify(brand)}
Creator: ${JSON.stringify(creator)}
Campaign: ${JSON.stringify(campaign)}
Terms: ${JSON.stringify(terms)}

Return JSON:
{
  "contract_text": "Full contract text with sections: PARTIES, SCOPE OF WORK, COMPENSATION, TIMELINE, CONTENT RIGHTS, EXCLUSIVITY, DISCLOSURE, TERMINATION. Mark as TEMPLATE - NOT LEGAL ADVICE."
}

Return ONLY the JSON.`

  return parseJSON<{ contract_text: string }>(prompt)
}

export async function checkBrandSafety(
  creator: Record<string, unknown>
): Promise<{ score: number; flags: string[]; recommendation: string }> {
  const prompt = `Evaluate brand safety for this influencer.

Creator: ${JSON.stringify(creator)}

Return JSON:
{
  "score": number (0-100, higher is safer),
  "flags": ["any concerns"],
  "recommendation": "SAFE | CAUTION | AVOID"
}

Return ONLY the JSON.`

  return parseJSON<{ score: number; flags: string[]; recommendation: string }>(prompt)
}
