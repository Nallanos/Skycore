/**
 * Global configuration for badge system
 * Contains thresholds, limits, and constants used across all badges
 */

// Time-based constants
export const TIME_CONFIG = {
  NIGHT_START_HOUR: 23,     // 11 PM
  NIGHT_END_HOUR: 7,        // 7 AM
  EARLY_MORNING_END: 7,     // 7 AM
  WORK_START_HOUR: 9,       // 9 AM
  WORK_END_HOUR: 17,        // 5 PM
  LUNCH_START_HOUR: 12,     // 12 PM
  LUNCH_END_HOUR: 14,       // 2 PM
  SIESTA_START_HOUR: 14,    // 2 PM
  SIESTA_END_HOUR: 16,      // 4 PM
}

// Activity thresholds
export const ACTIVITY_THRESHOLDS = {
  NEWBIE_MAX_POSTS: 5,
  SKY_ADDICT_POSTS_PER_DAY: 5,
  WEEKEND_POSTER_PERCENTAGE: 80,    // 80% of posts on weekends
  COMEBACK_GAP_DAYS: 30,            // 30 days silence then comeback
  VIRAL_THRESHOLD_LIKES: 100,       // Minimum likes for viral post
  HIGH_ENGAGEMENT_LIKES: 50,        // High engagement threshold
}

// Ratio and stats thresholds
export const STATS_THRESHOLDS = {
  QUALITY_CIRCLE_RATIO: 1.5,        // followers/following > 1.5
  DESPERATE_NETWORKER_RATIO: 10,    // following/followers > 10
  COLLECTOR_FOLLOWING_COUNT: 1000,   // following > 1000
  TINY_BUT_MIGHTY_MAX_FOLLOWERS: 100, // followers < 100
  LOUDSPEAKER_POSTS_REPLIES_RATIO: 3, // posts/replies > 3
}

// Content analysis thresholds
export const CONTENT_THRESHOLDS = {
  MINIMALIST_MAX_CHARS: 50,         // Average post length < 50
  ESSAYIST_MIN_CHARS: 200,          // Average post length > 200
  EMOJI_DEALER_PERCENTAGE: 80,      // 80% posts with emojis
  HASHTAG_HOARDER_COUNT: 3,         // 3+ hashtags per post
  LINK_PUSHER_PERCENTAGE: 50,       // 50% posts with links
}

// Temporal pattern thresholds
export const TEMPORAL_THRESHOLDS = {
  NIGHT_OWL_PERCENTAGE: 30,         // 30% posts after 11 PM
  EARLY_BIRD_PERCENTAGE: 30,        // 30% posts before 7 AM
  WEEKEND_WARRIOR_PERCENTAGE: 80,   // 80% posts on weekends
  BLUE_MONDAY_MULTIPLIER: 3,        // 3x more posts on Monday
  JETLAG_HOUR_SPREAD: 16,           // Posts spread across 16+ hours
}

// Social interaction thresholds
export const SOCIAL_THRESHOLDS = {
  REPLY_MACHINE_RATIO: 1,           // replies > posts
  CONVERSATION_STARTER_REPLIES: 5,  // Posts that get 5+ replies
  WALLFLOWER_MAX_INTERACTIONS: 10,  // Very low total interactions
  MENTIONS_GOBLIN_COUNT: 5,         // 5+ mentions per post
}

// System limits
export const SYSTEM_LIMITS = {
  MAX_BADGES_IN_EMAIL: 5,           // Maximum badges to show in email
  ANALYSIS_PERIOD_DAYS: 30,         // Days to analyze for patterns
  MIN_POSTS_FOR_ANALYSIS: 3,        // Minimum posts needed for most badges
  CACHE_DURATION_HOURS: 24,         // Cache analytics for 24 hours
}

// Badge categories with priorities
export const BADGE_CATEGORIES = {
  ACTIVITY: { name: 'Activity', priority: 1 },
  TEMPORAL: { name: 'Time Patterns', priority: 2 },
  SOCIAL: { name: 'Social Interaction', priority: 3 },
  CONTENT: { name: 'Writing Style', priority: 4 },
  STATS: { name: 'Stats & Ratios', priority: 5 },
  PERFORMANCE: { name: 'Performance', priority: 6 },
  PERSONALITY: { name: 'Personality', priority: 7 },
  HABITS: { name: 'Special Habits', priority: 8 },
  STREAKS: { name: 'Streaks', priority: 9 },
  EASTER_EGGS: { name: 'Easter Eggs', priority: 10 },
}

// Keywords for content analysis
export const CONTENT_KEYWORDS = {
  PHILOSOPHICAL: ['philosophy', 'existence', 'meaning', 'consciousness', 'reality', 'truth', 'wisdom', 'ethics', 'morality'],
  CONTROVERSIAL: ['controversial', 'unpopular', 'hot take', 'debate', 'argue', 'disagree', 'problematic'],
  POSITIVE: ['amazing', 'great', 'awesome', 'love', 'beautiful', 'wonderful', 'fantastic', 'brilliant', 'perfect'],
  ARGUMENTATIVE: ['wrong', 'disagree', 'actually', 'but', 'however', 'argue', 'debate', 'prove', 'evidence'],
  WHOLESOME: ['wholesome', 'sweet', 'kind', 'caring', 'support', 'help', 'love', 'heart', 'grateful', 'thankful'],
  CHAOS: ['chaos', 'random', 'weird', 'strange', 'wtf', 'lol', 'haha', 'meme', 'shitpost', 'cursed'],
}

// Utility functions for badge evaluation
export const BADGE_UTILS = {
  /**
   * Check if hour is in night time range
   */
  isNightHour: (hour) => hour >= TIME_CONFIG.NIGHT_START_HOUR || hour < TIME_CONFIG.NIGHT_END_HOUR,
  
  /**
   * Check if hour is in work time range
   */
  isWorkHour: (hour) => hour >= TIME_CONFIG.WORK_START_HOUR && hour < TIME_CONFIG.WORK_END_HOUR,
  
  /**
   * Check if day is weekend
   */
  isWeekend: (date) => {
    const day = new Date(date).getDay()
    return day === 0 || day === 6 // Sunday or Saturday
  },
  
  /**
   * Calculate percentage
   */
  percentage: (part, total) => total === 0 ? 0 : (part / total) * 100,
  
  /**
   * Check if text contains keywords from a category
   */
  containsKeywords: (text, keywords) => {
    const lowerText = text.toLowerCase()
    return keywords.some(keyword => lowerText.includes(keyword))
  }
}