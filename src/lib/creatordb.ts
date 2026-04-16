import type { Creator, CreatorSearchFilters, CreatorMetrics } from '@/types'
import { mockCreators, getMockCreatorsByFilters } from './mock-creators'
import { createSupabaseServiceClient } from './supabase'

const CREATORDB_BASE_URL = 'https://apiv3.creatordb.app'
const CACHE_TTL_HOURS = 24

async function fetchFromCreatorDB(path: string): Promise<unknown> {
  const apiKey = process.env.CREATORDB_API_KEY
  if (!apiKey) throw new Error('CREATORDB_API_KEY not set')
  
  const res = await fetch(`${CREATORDB_BASE_URL}${path}`, {
    headers: { 'api-key': apiKey },
    next: { revalidate: 3600 }
  })
  
  if (!res.ok) throw new Error(`CreatorDB error: ${res.status}`)
  return res.json()
}

function mapCreatorDBToCreator(raw: Record<string, unknown>): Creator {
  return {
    id: String(raw.id || ''),
    external_id: String(raw.id || ''),
    handle: String(raw.username || raw.handle || '').replace('@', '').toLowerCase(),
    full_name: String(raw.name || raw.full_name || ''),
    platform: String(raw.platform || 'Instagram'),
    profile_url: String(raw.profile_url || raw.url || ''),
    avatar_url: String(raw.avatar || raw.avatar_url || ''),
    bio: String(raw.bio || raw.description || ''),
    follower_count: Number(raw.followers || raw.follower_count || 0),
    engagement_rate: Number(raw.engagement_rate || raw.er || 0),
    avg_likes: Number(raw.avg_likes || 0),
    avg_comments: Number(raw.avg_comments || 0),
    avg_views: Number(raw.avg_views || 0),
    audience_demographics: (raw.audience_demographics as Creator['audience_demographics']) || null,
    categories: (raw.categories as string[]) || [],
    past_brand_deals: (raw.past_brand_deals as string[]) || [],
    estimated_cpm: Number(raw.estimated_cpm || 10),
    estimated_rate_per_post: Number(raw.estimated_rate || raw.estimated_rate_per_post || 0),
    contact_email: String(raw.email || raw.contact_email || ''),
    location: String(raw.location || raw.country || ''),
    brand_safety_score: Number(raw.brand_safety_score || 75),
    fake_follower_percentage: Number(raw.fake_follower_percentage || raw.fake_followers || 0),
    last_updated: String(raw.updated_at || new Date().toISOString()),
  }
}

export async function searchCreators(filters: CreatorSearchFilters): Promise<Creator[]> {
  const apiKey = process.env.CREATORDB_API_KEY
  
  // Use mock data if no API key
  if (!apiKey) {
    return getMockCreatorsByFilters(filters)
  }
  
  // Check cache
  try {
    const supabase = createSupabaseServiceClient()
    const cacheKey = JSON.stringify(filters)
    const { data: cached } = await supabase
      .from('creators')
      .select('*')
      .gt('last_updated', new Date(Date.now() - CACHE_TTL_HOURS * 3600000).toISOString())
      .limit(filters.limit || 20)
    
    if (cached && cached.length > 0) {
      return cached as Creator[]
    }
  } catch {
    // Cache miss, continue
  }
  
  try {
    const params = new URLSearchParams()
    if (filters.platform?.length) params.set('platform', filters.platform.join(','))
    if (filters.categories?.length) params.set('categories', filters.categories.join(','))
    if (filters.min_followers) params.set('min_followers', String(filters.min_followers))
    if (filters.max_followers) params.set('max_followers', String(filters.max_followers))
    if (filters.min_engagement) params.set('min_engagement_rate', String(filters.min_engagement))
    if (filters.limit) params.set('limit', String(filters.limit))
    
    const data = await fetchFromCreatorDB(`/creators/search?${params}`) as { data?: unknown[] }
    const creators = (data?.data || []).map(r => mapCreatorDBToCreator(r as Record<string, unknown>))
    
    // Cache results
    try {
      const supabase = createSupabaseServiceClient()
      if (creators.length > 0) {
        await supabase.from('creators').upsert(creators, { onConflict: 'external_id' })
      }
    } catch {}
    
    return creators
  } catch {
    // Fall back to mock data
    return getMockCreatorsByFilters(filters)
  }
}

export async function getCreatorById(id: string): Promise<Creator | null> {
  // Check mock first
  const mockCreator = mockCreators.find(c => c.id === id || c.external_id === id)
  if (mockCreator) return mockCreator
  
  const apiKey = process.env.CREATORDB_API_KEY
  if (!apiKey) return null
  
  try {
    // Check Supabase cache
    const supabase = createSupabaseServiceClient()
    const { data: cached } = await supabase
      .from('creators')
      .select('*')
      .or(`id.eq.${id},external_id.eq.${id}`)
      .single()
    
    if (cached) return cached as Creator
    
    const data = await fetchFromCreatorDB(`/creators/${id}`) as { data?: Record<string, unknown> }
    if (!data?.data) return null
    
    const creator = mapCreatorDBToCreator(data.data)
    
    // Cache it
    await supabase.from('creators').upsert(creator, { onConflict: 'external_id' })
    return creator
  } catch {
    return null
  }
}

export async function getCreatorMetrics(id: string): Promise<CreatorMetrics | null> {
  const apiKey = process.env.CREATORDB_API_KEY
  if (!apiKey) {
    // Return mock metrics
    const creator = mockCreators.find(c => c.id === id)
    if (!creator) return null
    return {
      creator_id: id,
      avg_engagement_rate: creator.engagement_rate,
      avg_likes: creator.avg_likes,
      avg_comments: creator.avg_comments,
      avg_views: creator.avg_views,
      follower_growth_rate: 2.5,
      posting_frequency: 4,
      best_performing_content: creator.categories || [],
      audience_quality_score: creator.brand_safety_score,
    }
  }
  
  try {
    const data = await fetchFromCreatorDB(`/creators/${id}/metrics`) as { data?: Record<string, unknown> }
    if (!data?.data) return null
    return data.data as unknown as CreatorMetrics
  } catch {
    return null
  }
}

export async function checkCompetitorDeals(creatorId: string, competitors: string[]): Promise<boolean> {
  const apiKey = process.env.CREATORDB_API_KEY
  if (!apiKey) return false
  
  try {
    const creator = await getCreatorById(creatorId)
    if (!creator) return false
    
    const pastDeals = creator.past_brand_deals || []
    return competitors.some(comp => 
      pastDeals.some(deal => deal.toLowerCase().includes(comp.toLowerCase()))
    )
  } catch {
    return false
  }
}
