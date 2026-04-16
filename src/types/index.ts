export interface Brand {
  id: string
  user_id: string
  name: string
  industry: string | null
  website: string | null
  logo_url: string | null
  target_audience: TargetAudience | null
  tone_of_voice: string | null
  competitor_brands: string[] | null
  brand_values: string[] | null
  plan: 'free' | 'starter' | 'growth' | 'enterprise'
  created_at: string
}

export interface TargetAudience {
  age_range?: string[]
  gender?: string[]
  locations?: string[]
  interests?: string[]
}

export interface Campaign {
  id: string
  brand_id: string
  name: string
  objective: string | null
  budget_total: number | null
  budget_remaining: number | null
  platforms: string[] | null
  content_types: string[] | null
  timeline_start: string | null
  timeline_end: string | null
  brief_summary: string | null
  key_messages: string[] | null
  hashtags: string[] | null
  cta: string | null
  dos: string[] | null
  donts: string[] | null
  status: 'draft' | 'active' | 'paused' | 'completed'
  ai_generated_brief: AIGeneratedBrief | null
  created_at: string
}

export interface AIGeneratedBrief {
  strategy?: string
  bundle?: string
  content_angles?: string[]
  posting_schedule?: PostingSchedule[]
  estimated_reach?: number
  estimated_impressions?: number
  estimated_roi?: string
}

export interface PostingSchedule {
  week: number
  platform: string
  content_type: string
  creator_tier: string
}

export interface Creator {
  id: string
  external_id: string | null
  handle: string
  full_name: string
  platform: string
  profile_url: string | null
  avatar_url: string | null
  bio: string | null
  follower_count: number
  engagement_rate: number
  avg_likes: number
  avg_comments: number
  avg_views: number
  audience_demographics: AudienceDemographics | null
  categories: string[] | null
  past_brand_deals: string[] | null
  estimated_cpm: number
  estimated_rate_per_post: number
  contact_email: string | null
  location: string | null
  brand_safety_score: number
  fake_follower_percentage: number
  last_updated: string
  sample_captions?: string[]
}

export interface AudienceDemographics {
  age_18_24?: number
  age_25_34?: number
  age_35_44?: number
  age_45_plus?: number
  female?: number
  male?: number
  top_countries?: string[]
}

export interface CampaignCreator {
  id: string
  campaign_id: string
  creator_id: string
  fit_score: number | null
  score_breakdown: ScoreBreakdown | null
  status: 'shortlisted' | 'contacted' | 'negotiating' | 'confirmed' | 'declined' | 'completed'
  proposed_rate: number | null
  agreed_rate: number | null
  deliverables: Deliverable[] | null
  outreach_email_subject: string | null
  outreach_email_body: string | null
  outreach_sent_at: string | null
  outreach_opened_at: string | null
  contract_url: string | null
  notes: string | null
  added_at: string
  creator?: Creator
}

export interface ScoreBreakdown {
  audience_fit: number
  engagement_quality: number
  brand_safety: number
  content_alignment: number
  reach_value: number
  overall: number
  reasoning?: string
}

export interface Deliverable {
  platform: string
  content_type: string
  quantity: number
  due_date?: string
}

export interface Post {
  id: string
  campaign_creator_id: string
  platform: string | null
  post_url: string | null
  post_type: string | null
  tracking_link: string | null
  utm_params: Record<string, string> | null
  published_at: string | null
  likes: number
  comments: number
  shares: number
  views: number
  link_clicks: number
  conversions: number
  earned_media_value: number | null
  last_refreshed: string | null
}

export interface CreatorSearchFilters {
  platform?: string[]
  categories?: string[]
  min_followers?: number
  max_followers?: number
  min_engagement?: number
  max_engagement?: number
  location?: string[]
  min_brand_safety?: number
  max_cpm?: number
  limit?: number
}

export interface CreatorMetrics {
  creator_id: string
  avg_engagement_rate: number
  avg_likes: number
  avg_comments: number
  avg_views: number
  follower_growth_rate: number
  posting_frequency: number
  best_performing_content: string[]
  audience_quality_score: number
}
