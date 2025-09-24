// SkyScore calculation logic based on the plan
export const calculateSkyScore = (blueskyHandle) => {
  // MVP version: 50 + Random(-20 to +20)
  // In production, this would integrate with Bluesky API for real data
  const baseScore = 50
  const randomVariation = Math.floor(Math.random() * 41) - 20 // -20 to +20
  const score = Math.max(0, Math.min(100, baseScore + randomVariation))
  
  return score
}

/**
 * Calculate SkyScore with badges integration
 * @param {string} blueskyHandle - User's Bluesky handle
 * @returns {Object} Enhanced score data with badges
 */
export const calculateSkyScoreWithBadges = async (blueskyHandle) => {
  try {
    // Import here to avoid circular dependencies
    const { getBadgeAggregationService } = await import('./badgeAggregationService.js')
    const badgeService = getBadgeAggregationService()
    
    // Calculate traditional SkyScore
    const skyScore = calculateSkyScore(blueskyHandle)
    const archetype = getArchetype(skyScore)
    
    // Calculate badges
    const badgeData = await badgeService.calculateUserBadges(blueskyHandle)
    
    // Enhanced metrics based on badge analysis
    const enhancedMetrics = {
      totalPosts: badgeData.analytics.activity.totalPosts,
      avgPostsPerDay: badgeData.analytics.activity.avgPostsPerDay,
      avgLikesPerPost: badgeData.analytics.engagement.avgLikesPerPost,
      engagementScore: badgeData.analytics.engagement.engagementScore,
      mostActiveHour: badgeData.analytics.patterns.mostActiveHour,
      weekendActivity: badgeData.analytics.patterns.weekendPercentage,
      replyRatio: badgeData.analytics.patterns.replyPercentage,
    }
    
    return {
      skyScore,
      archetype,
      badges: badgeData.selectedBadges,
      allBadges: badgeData.allEarnedBadges,
      metrics: enhancedMetrics,
      insights: badgeService.getBadgeInsights(badgeData.allEarnedBadges, badgeData.analytics),
      metadata: {
        calculatedAt: new Date().toISOString(),
        badgesEarned: badgeData.metadata.totalBadgesEarned,
        badgesAvailable: badgeData.metadata.totalBadgesAvailable
      }
    }
  } catch (error) {
    console.error('Error calculating SkyScore with badges:', error)
    
    // Fallback to basic SkyScore
    const skyScore = calculateSkyScore(blueskyHandle)
    const archetype = getArchetype(skyScore)
    
    return {
      skyScore,
      archetype,
      badges: [],
      allBadges: [],
      metrics: {},
      insights: { strengths: [], improvements: [], personality: 'Unknown' },
      metadata: { calculatedAt: new Date().toISOString(), error: error.message }
    }
  }
}

export const getArchetype = (score) => {
  if (score >= 80) return "Influencer"
  if (score >= 60) return "Connector"
  if (score >= 40) return "Explorer"
  return "Rookie"
}

export const getArchetypeDescription = (archetype) => {
  const descriptions = {
    "Influencer": "You're a powerhouse on Bluesky! Your content resonates widely and drives meaningful conversations.",
    "Connector": "You excel at bringing people together and fostering community connections across the platform.",
    "Explorer": "You're actively discovering and engaging with diverse content, building your unique voice.",
    "Rookie": "You're just getting started on your Bluesky journey. Great potential ahead!"
  }
  
  return descriptions[archetype] || "Your unique Bluesky presence is developing beautifully."
}

export const getArchetypeColor = (archetype) => {
  const colors = {
    "Influencer": "#FF6B6B",  // Red
    "Connector": "#4ECDC4",   // Teal
    "Explorer": "#45B7D1",    // Blue
    "Rookie": "#96CEB4"       // Green
  }
  
  return colors[archetype] || "#45B7D1"
}