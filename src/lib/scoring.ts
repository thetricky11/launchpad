import type { Creator, Campaign, ScoreBreakdown } from '@/types'

export function scoreCreatorForCampaign(creator: Creator, campaign: Campaign): ScoreBreakdown {
  // Engagement quality score (0-100)
  let engagementScore = 0
  if (creator.engagement_rate >= 6) engagementScore = 95
  else if (creator.engagement_rate >= 4) engagementScore = 80
  else if (creator.engagement_rate >= 2) engagementScore = 60
  else engagementScore = 40

  // Reach value score based on follower count tier
  let reachScore = 0
  if (creator.follower_count >= 1000000) reachScore = 95
  else if (creator.follower_count >= 500000) reachScore = 85
  else if (creator.follower_count >= 100000) reachScore = 70
  else if (creator.follower_count >= 50000) reachScore = 60
  else if (creator.follower_count >= 10000) reachScore = 50
  else reachScore = 35

  // Brand safety score
  const brandSafetyScore = creator.brand_safety_score || 75

  // Fake follower penalty
  const fakePenalty = Math.min(30, (creator.fake_follower_percentage || 0) * 2)
  const adjustedBrandSafety = Math.max(0, brandSafetyScore - fakePenalty)

  // Audience fit (platform match)
  let audienceFitScore = 50
  const campaignPlatforms = campaign.platforms || []
  if (campaignPlatforms.includes(creator.platform)) {
    audienceFitScore += 30
  }
  
  // Category alignment
  const campaignObjective = campaign.objective?.toLowerCase() || ''
  const creatorCategories = creator.categories || []
  const categoryMatches = creatorCategories.filter(cat => 
    campaignObjective.includes(cat) || 
    creatorCategories.some(c => campaignObjective.includes(c))
  ).length
  audienceFitScore = Math.min(100, audienceFitScore + (categoryMatches * 10))

  // Content alignment
  const contentTypes = campaign.content_types || []
  let contentAlignmentScore = 60
  if (creator.platform === 'TikTok' && contentTypes.some(t => t.toLowerCase().includes('video') || t.toLowerCase().includes('reel') || t.toLowerCase().includes('short'))) {
    contentAlignmentScore = 90
  } else if (creator.platform === 'Instagram' && contentTypes.some(t => t.toLowerCase().includes('reel') || t.toLowerCase().includes('story') || t.toLowerCase().includes('post'))) {
    contentAlignmentScore = 90
  } else if (creator.platform === 'YouTube' && contentTypes.some(t => t.toLowerCase().includes('video') || t.toLowerCase().includes('youtube'))) {
    contentAlignmentScore = 90
  }

  const overall = Math.round(
    (engagementScore * 0.25) +
    (reachScore * 0.20) +
    (adjustedBrandSafety * 0.20) +
    (audienceFitScore * 0.20) +
    (contentAlignmentScore * 0.15)
  )

  return {
    audience_fit: Math.round(audienceFitScore),
    engagement_quality: Math.round(engagementScore),
    brand_safety: Math.round(adjustedBrandSafety),
    content_alignment: Math.round(contentAlignmentScore),
    reach_value: Math.round(reachScore),
    overall,
    reasoning: `Score based on ${creator.follower_count.toLocaleString()} followers, ${creator.engagement_rate}% engagement rate, brand safety ${creator.brand_safety_score}/100`
  }
}

export function sortCreatorsByScore(
  creators: Creator[],
  campaign: Campaign
): Array<Creator & { score: ScoreBreakdown }> {
  return creators
    .map(creator => ({ ...creator, score: scoreCreatorForCampaign(creator, campaign) }))
    .sort((a, b) => b.score.overall - a.score.overall)
}
