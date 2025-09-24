/**
 * User Analytics Service - Process raw user data into badge-ready metrics
 * Transforms collected data into analyzable patterns and statistics
 */

import { BADGE_UTILS, TIME_CONFIG } from '../badges/config/BadgeConfig.js'

export class UserAnalyticsService {
  /**
   * Calculate comprehensive analytics from user data
   * @param {Object} userData - Raw user data from UserDataService
   * @returns {Object} Processed analytics ready for badge evaluation
   */
  async calculateAnalytics(userData) {
    const { profile, posts, interactions } = userData
    
    console.log(`📊 Calculating analytics for ${profile.handle}`)
    
    if (!posts || posts.length === 0) {
      return this.getEmptyAnalytics(profile)
    }

    const analytics = {
      profile: this.processProfile(profile),
      activity: this.calculateActivityMetrics(posts, profile),
      temporal: this.calculateTemporalPatterns(posts),
      content: this.calculateContentMetrics(posts),
      social: this.calculateSocialMetrics(posts, interactions, profile),
      engagement: this.calculateEngagementMetrics(posts, interactions),
      patterns: this.detectPatterns(posts),
      metadata: {
        calculatedAt: new Date().toISOString(),
        postsAnalyzed: posts.length,
        analysisWindow: this.getAnalysisWindow(posts)
      }
    }

    return analytics
  }

  /**
   * Process basic profile information
   */
  processProfile(profile) {
    const accountAge = Date.now() - new Date(profile.joinedDate).getTime()
    const accountAgeDays = Math.floor(accountAge / (24 * 60 * 60 * 1000))
    
    return {
      handle: profile.handle,
      followers: profile.followers || 0,
      following: profile.following || 0,
      postsCount: profile.postsCount || 0,
      accountAgeDays,
      followerRatio: profile.following > 0 ? profile.followers / profile.following : 0,
      followingRatio: profile.followers > 0 ? profile.following / profile.followers : 0,
    }
  }

  /**
   * Calculate activity-based metrics
   */
  calculateActivityMetrics(posts, profile) {
    const now = Date.now()
    const oneDayMs = 24 * 60 * 60 * 1000
    const oneWeekMs = 7 * oneDayMs
    const thirtyDaysMs = 30 * oneDayMs
    
    // Filter recent posts
    const last7Days = posts.filter(post => now - new Date(post.createdAt).getTime() < oneWeekMs)
    const last30Days = posts.filter(post => now - new Date(post.createdAt).getTime() < thirtyDaysMs)
    
    // Calculate daily posting rate
    const analysisWindow = this.getAnalysisWindow(posts)
    const avgPostsPerDay = analysisWindow > 0 ? posts.length / analysisWindow : 0
    
    // Check for posting gaps
    const postGaps = this.calculatePostingGaps(posts)
    const longestGap = Math.max(...postGaps, 0)
    
    return {
      totalPosts: posts.length,
      postsLast7Days: last7Days.length,
      postsLast30Days: last30Days.length,
      avgPostsPerDay,
      longestGapDays: longestGap,
      hasRecentActivity: last7Days.length > 0,
      isActiveUser: avgPostsPerDay > 0.5, // At least one post every 2 days
      postingConsistency: this.calculateConsistency(posts),
    }
  }

  /**
   * Calculate temporal posting patterns
   */
  calculateTemporalPatterns(posts) {
    const hourlyDistribution = new Array(24).fill(0)
    const dailyDistribution = new Array(7).fill(0) // 0 = Sunday
    const monthlyDistribution = new Array(12).fill(0)
    
    let nightPosts = 0
    let earlyMorningPosts = 0
    let workHourPosts = 0
    let weekendPosts = 0
    let lunchTimePosts = 0
    let siestaTimePosts = 0
    
    posts.forEach(post => {
      const date = new Date(post.createdAt)
      const hour = date.getHours()
      const day = date.getDay()
      const month = date.getMonth()
      
      hourlyDistribution[hour]++
      dailyDistribution[day]++
      monthlyDistribution[month]++
      
      // Count time-based patterns
      if (BADGE_UTILS.isNightHour(hour)) nightPosts++
      if (hour < TIME_CONFIG.EARLY_MORNING_END) earlyMorningPosts++
      if (BADGE_UTILS.isWorkHour(hour)) workHourPosts++
      if (BADGE_UTILS.isWeekend(date)) weekendPosts++
      if (hour >= TIME_CONFIG.LUNCH_START_HOUR && hour < TIME_CONFIG.LUNCH_END_HOUR) lunchTimePosts++
      if (hour >= TIME_CONFIG.SIESTA_START_HOUR && hour < TIME_CONFIG.SIESTA_END_HOUR) siestaTimePosts++
    })
    
    // Calculate percentages
    const total = posts.length
    
    return {
      hourlyDistribution,
      dailyDistribution,
      monthlyDistribution,
      nightPostsPercentage: BADGE_UTILS.percentage(nightPosts, total),
      earlyMorningPercentage: BADGE_UTILS.percentage(earlyMorningPosts, total),
      workHourPercentage: BADGE_UTILS.percentage(workHourPosts, total),
      weekendPercentage: BADGE_UTILS.percentage(weekendPosts, total),
      lunchTimePercentage: BADGE_UTILS.percentage(lunchTimePosts, total),
      siestaTimePercentage: BADGE_UTILS.percentage(siestaTimePosts, total),
      mostActiveHour: hourlyDistribution.indexOf(Math.max(...hourlyDistribution)),
      mostActiveDay: dailyDistribution.indexOf(Math.max(...dailyDistribution)),
      hourSpread: this.calculateHourSpread(hourlyDistribution),
    }
  }

  /**
   * Calculate content-related metrics
   */
  calculateContentMetrics(posts) {
    let totalChars = 0
    let postsWithEmojis = 0
    let postsWithLinks = 0
    let totalHashtags = 0
    let repliesCount = 0
    let originalPosts = 0
    
    const textContent = []
    
    posts.forEach(post => {
      totalChars += post.text.length
      textContent.push(post.text.toLowerCase())
      
      if (post.hasEmojis) postsWithEmojis++
      if (post.hasLinks) postsWithLinks++
      if (post.hashtagCount) totalHashtags += post.hashtagCount
      if (post.isReply) {
        repliesCount++
      } else {
        originalPosts++
      }
    })
    
    const avgPostLength = posts.length > 0 ? totalChars / posts.length : 0
    const avgHashtagsPerPost = posts.length > 0 ? totalHashtags / posts.length : 0
    
    return {
      avgPostLength,
      avgHashtagsPerPost,
      emojiPercentage: BADGE_UTILS.percentage(postsWithEmojis, posts.length),
      linkPercentage: BADGE_UTILS.percentage(postsWithLinks, posts.length),
      repliesPercentage: BADGE_UTILS.percentage(repliesCount, posts.length),
      replyToPostRatio: originalPosts > 0 ? repliesCount / originalPosts : 0,
      contentStyle: this.analyzeContentStyle(textContent),
      totalReplies: repliesCount,
      totalOriginalPosts: originalPosts,
    }
  }

  /**
   * Calculate social interaction metrics
   */
  calculateSocialMetrics(posts, interactions, profile) {
    const totalLikes = posts.reduce((sum, post) => sum + (post.likes || 0), 0)
    const totalReplies = posts.reduce((sum, post) => sum + (post.replies || 0), 0)
    const totalReposts = posts.reduce((sum, post) => sum + (post.reposts || 0), 0)
    
    const avgLikesPerPost = posts.length > 0 ? totalLikes / posts.length : 0
    const avgRepliesPerPost = posts.length > 0 ? totalReplies / posts.length : 0
    const avgRepostsPerPost = posts.length > 0 ? totalReposts / posts.length : 0
    
    // Find viral posts
    const viralPosts = posts.filter(post => post.likes > 50) // Threshold for viral
    const bestPost = posts.reduce((best, post) => 
      (post.likes || 0) > (best.likes || 0) ? post : best, posts[0] || {})
    
    return {
      totalLikes,
      totalReplies,
      totalReposts,
      avgLikesPerPost,
      avgRepliesPerPost,
      avgRepostsPerPost,
      viralPostsCount: viralPosts.length,
      bestPostLikes: bestPost.likes || 0,
      engagementRate: this.calculateEngagementRate(posts, profile),
      interactionRatio: interactions ? this.calculateInteractionRatio(interactions) : {},
    }
  }

  /**
   * Calculate engagement-specific metrics
   */
  calculateEngagementMetrics(posts, interactions) {
    const engagementScore = posts.reduce((score, post) => {
      return score + (post.likes || 0) + (post.replies || 0) * 2 + (post.reposts || 0) * 1.5
    }, 0)
    
    return {
      engagementScore,
      avgEngagementPerPost: posts.length > 0 ? engagementScore / posts.length : 0,
      interactionsGiven: interactions ? 
        (interactions.likesGiven || 0) + (interactions.repliesGiven || 0) : 0,
      interactionsReceived: posts.reduce((sum, post) => 
        sum + (post.likes || 0) + (post.replies || 0) + (post.reposts || 0), 0),
    }
  }

  /**
   * Detect specific behavioral patterns
   */
  detectPatterns(posts) {
    if (posts.length === 0) return {}
    
    return {
      isGhost: posts.length === 0,
      isNewbie: posts.length < 5,
      isLurker: posts.filter(p => !p.isReply).length < posts.length * 0.2,
      isReplyHeavy: posts.filter(p => p.isReply).length > posts.length * 0.7,
      hasPostingStreaks: this.detectStreaks(posts),
      hasLongSilences: this.detectSilences(posts),
      postedToday: this.postedInLastHours(posts, 24),
      postedThisWeek: this.postedInLastHours(posts, 24 * 7),
    }
  }

  // Helper methods

  getEmptyAnalytics(profile) {
    return {
      profile: this.processProfile(profile),
      activity: { totalPosts: 0, avgPostsPerDay: 0, isActiveUser: false },
      temporal: { hourlyDistribution: new Array(24).fill(0) },
      content: { avgPostLength: 0 },
      social: { avgLikesPerPost: 0 },
      engagement: { engagementScore: 0 },
      patterns: { isGhost: true },
      metadata: { calculatedAt: new Date().toISOString(), postsAnalyzed: 0 }
    }
  }

  calculatePostingGaps(posts) {
    if (posts.length < 2) return [0]
    
    const gaps = []
    for (let i = 1; i < posts.length; i++) {
      const gap = new Date(posts[i-1].createdAt) - new Date(posts[i].createdAt)
      gaps.push(Math.floor(gap / (24 * 60 * 60 * 1000))) // Convert to days
    }
    return gaps
  }

  calculateConsistency(posts) {
    if (posts.length < 7) return 0
    
    const daily = new Array(7).fill(0)
    posts.forEach(post => {
      const day = new Date(post.createdAt).getDay()
      daily[day]++
    })
    
    const mean = daily.reduce((a, b) => a + b) / 7
    const variance = daily.reduce((sum, count) => sum + Math.pow(count - mean, 2), 0) / 7
    
    return mean > 0 ? 1 - (Math.sqrt(variance) / mean) : 0
  }

  calculateHourSpread(hourlyDistribution) {
    let activeHours = 0
    hourlyDistribution.forEach(count => {
      if (count > 0) activeHours++
    })
    return activeHours
  }

  analyzeContentStyle(textContent) {
    const allText = textContent.join(' ')
    
    return {
      isMinimalist: textContent.every(text => text.length < 50),
      isVerbose: textContent.some(text => text.length > 200),
      hasPhilosophical: allText.includes('philosophy') || allText.includes('meaning'),
      hasHumor: allText.includes('lol') || allText.includes('haha'),
      isControversial: allText.includes('controversial') || allText.includes('hot take'),
    }
  }

  calculateEngagementRate(posts, profile) {
    if (!profile.followers || posts.length === 0) return 0
    
    const totalEngagement = posts.reduce((sum, post) => 
      sum + (post.likes || 0) + (post.replies || 0) + (post.reposts || 0), 0)
    
    return totalEngagement / (posts.length * profile.followers)
  }

  calculateInteractionRatio(interactions) {
    return {
      givesToReceivesRatio: interactions.interactionsReceived > 0 ? 
        interactions.interactionsGiven / interactions.interactionsReceived : 0
    }
  }

  getAnalysisWindow(posts) {
    if (posts.length === 0) return 0
    
    const oldest = new Date(posts[posts.length - 1].createdAt)
    const newest = new Date(posts[0].createdAt)
    const diffMs = newest - oldest
    
    return Math.max(1, Math.floor(diffMs / (24 * 60 * 60 * 1000))) // Days
  }

  detectStreaks(posts) {
    // Simple streak detection - posts on consecutive days
    // Implementation would be more complex in production
    return posts.length > 5 // Placeholder
  }

  detectSilences(posts) {
    const gaps = this.calculatePostingGaps(posts)
    return gaps.some(gap => gap > 7) // Has gaps > 7 days
  }

  postedInLastHours(posts, hours) {
    const cutoff = Date.now() - (hours * 60 * 60 * 1000)
    return posts.some(post => new Date(post.createdAt).getTime() > cutoff)
  }
}