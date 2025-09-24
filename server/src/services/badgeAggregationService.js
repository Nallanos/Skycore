/**
 * Badge Aggregation Service - Select and prioritize badges for display
 * Handles badge selection logic and prepares them for email/UI display
 */

import { getBadgeFactory } from '../badges/BadgeFactory.js'
import { UserDataService } from './userDataService.js'
import { UserAnalyticsService } from './userAnalyticsService.js'
import { SYSTEM_LIMITS } from '../badges/config/BadgeConfig.js'

export class BadgeAggregationService {
  constructor() {
    this.userDataService = new UserDataService()
    this.analyticsService = new UserAnalyticsService()
    this.badgeFactory = getBadgeFactory()
  }

  /**
   * Calculate user badges with selection algorithm
   * @param {string} blueskyHandle - User's Bluesky handle
   * @returns {Object} Selected badges with metadata
   */
  async calculateUserBadges(blueskyHandle) {
    console.log(`🎖️ Calculating badges for ${blueskyHandle}`)
    
    try {
      // Step 1: Collect user data
      const userData = await this.userDataService.collectUserData(blueskyHandle)
      
      // Step 2: Calculate analytics
      const analytics = await this.analyticsService.calculateAnalytics(userData)
      
      // Step 3: Evaluate all badges
      const allEarnedBadges = await this.badgeFactory.evaluateAllBadges(userData, analytics)
      
      // Step 4: Select top badges for display
      const selectedBadges = this.selectTopBadges(allEarnedBadges)
      
      // Step 5: Prepare badge data for response
      const badgeData = {
        selectedBadges,
        allEarnedBadges,
        analytics: this.sanitizeAnalytics(analytics),
        metadata: {
          totalBadgesEarned: allEarnedBadges.length,
          totalBadgesAvailable: this.badgeFactory.getAllEvaluators().length,
          calculatedAt: new Date().toISOString(),
          handle: blueskyHandle
        }
      }

      console.log(`✅ Badge calculation complete: ${selectedBadges.length} selected, ${allEarnedBadges.length} total earned`)
      return badgeData
      
    } catch (error) {
      console.error(`❌ Error calculating badges for ${blueskyHandle}:`, error)
      return this.getEmptyBadgeData(blueskyHandle)
    }
  }

  /**
   * Select top badges for display based on priority and rarity
   * @param {Array} earnedBadges - All earned badges
   * @returns {Array} Selected badges for display
   */
  selectTopBadges(earnedBadges) {
    if (earnedBadges.length === 0) {
      return []
    }

    // Sort by priority first, then by rarity (less common badges are more interesting)
    const sortedBadges = earnedBadges.sort((a, b) => {
      // Primary sort: priority (higher = more important)
      if (a.priority !== b.priority) {
        return b.priority - a.priority
      }
      
      // Secondary sort: rarity could be calculated here
      // For now, just maintain original order
      return 0
    })

    // Select top badges up to the limit
    const selectedBadges = sortedBadges.slice(0, SYSTEM_LIMITS.MAX_BADGES_IN_EMAIL)
    
    console.log(`🎯 Selected ${selectedBadges.length} badges:`, 
      selectedBadges.map(b => `${b.name} ${b.emoji}`).join(', '))
    
    return selectedBadges
  }

  /**
   * Calculate badge rarity (for future implementation)
   * This would require tracking badge statistics across all users
   * @param {string} badgeId - Badge identifier
   * @returns {number} Rarity score (0-1, higher = more rare)
   */
  calculateBadgeRarity(badgeId) {
    // TODO: Implement rarity calculation based on user statistics
    // For now, return neutral rarity
    return 0.5
  }

  /**
   * Get badge insights and recommendations
   * @param {Array} earnedBadges - User's earned badges
   * @param {Object} analytics - User analytics
   * @returns {Object} Insights and recommendations
   */
  getBadgeInsights(earnedBadges, analytics) {
    const insights = {
      strengths: [],
      improvements: [],
      personality: this.inferPersonality(earnedBadges),
      nextBadges: this.suggestNextBadges(earnedBadges, analytics)
    }

    // Analyze earned badges for insights
    earnedBadges.forEach(badge => {
      switch (badge.category) {
        case 'ACTIVITY':
          if (badge.id === 'sky_addict') {
            insights.strengths.push('Highly active user')
          } else if (badge.id === 'ghost') {
            insights.improvements.push('Try posting some content to get started')
          }
          break
        // Add more categories as they are implemented
      }
    })

    return insights
  }

  /**
   * Infer user personality from badges
   * @param {Array} earnedBadges - User's earned badges
   * @returns {string} Personality type
   */
  inferPersonality(earnedBadges) {
    const badgeIds = earnedBadges.map(b => b.id)
    
    if (badgeIds.includes('ghost')) return 'Observer'
    if (badgeIds.includes('sky_addict')) return 'Social Butterfly'
    if (badgeIds.includes('echo')) return 'Conversationalist'
    if (badgeIds.includes('time_traveler')) return 'Night Owl'
    if (badgeIds.includes('newbie')) return 'Explorer'
    
    return 'Unique Individual'
  }

  /**
   * Suggest badges user could earn next
   * @param {Array} earnedBadges - Current earned badges
   * @param {Object} analytics - User analytics
   * @returns {Array} Suggested badges to work towards
   */
  suggestNextBadges(earnedBadges, analytics) {
    const earnedIds = earnedBadges.map(b => b.id)
    const suggestions = []
    
    // Simple suggestion logic based on current analytics
    if (!earnedIds.includes('sky_addict') && analytics.activity?.avgPostsPerDay > 3) {
      suggestions.push({
        id: 'sky_addict',
        name: 'Sky Addict',
        emoji: '🔥',
        tip: 'Post a bit more consistently to earn this badge!'
      })
    }

    if (!earnedIds.includes('weekend_poster') && analytics.temporal?.weekendPercentage > 60) {
      suggestions.push({
        id: 'weekend_poster',
        name: 'Weekend Poster',
        emoji: '🎉',
        tip: 'Focus your weekend posting to unlock this badge!'
      })
    }

    return suggestions.slice(0, 3) // Max 3 suggestions
  }

  /**
   * Sanitize analytics for public consumption
   * @param {Object} analytics - Full analytics object
   * @returns {Object} Sanitized analytics
   */
  sanitizeAnalytics(analytics) {
    return {
      activity: {
        totalPosts: analytics.activity.totalPosts,
        avgPostsPerDay: Math.round(analytics.activity.avgPostsPerDay * 10) / 10,
        isActiveUser: analytics.activity.isActiveUser,
      },
      engagement: {
        avgLikesPerPost: Math.round(analytics.social.avgLikesPerPost * 10) / 10,
        engagementScore: Math.round(analytics.engagement.avgEngagementPerPost * 10) / 10,
      },
      patterns: {
        mostActiveHour: analytics.temporal.mostActiveHour,
        weekendPercentage: Math.round(analytics.temporal.weekendPercentage),
        replyPercentage: Math.round(analytics.content.repliesPercentage),
      }
    }
  }

  /**
   * Get empty badge data for error cases
   * @param {string} blueskyHandle - User handle
   * @returns {Object} Empty badge data structure
   */
  getEmptyBadgeData(blueskyHandle) {
    return {
      selectedBadges: [],
      allEarnedBadges: [],
      analytics: {
        activity: { totalPosts: 0, avgPostsPerDay: 0, isActiveUser: false },
        engagement: { avgLikesPerPost: 0, engagementScore: 0 },
        patterns: { mostActiveHour: 12, weekendPercentage: 0, replyPercentage: 0 }
      },
      metadata: {
        totalBadgesEarned: 0,
        totalBadgesAvailable: this.badgeFactory.getAllEvaluators().length,
        calculatedAt: new Date().toISOString(),
        handle: blueskyHandle,
        error: 'Could not calculate badges'
      }
    }
  }
}

// Export singleton instance
let aggregationServiceInstance = null

export const getBadgeAggregationService = () => {
  if (!aggregationServiceInstance) {
    aggregationServiceInstance = new BadgeAggregationService()
  }
  return aggregationServiceInstance
}