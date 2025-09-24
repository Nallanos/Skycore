/**
 * Activity-based badges - Category 1
 * Badges based on user posting activity and behavior patterns
 */

import { BadgeEvaluator } from '../base/BadgeEvaluator.js'
import { ACTIVITY_THRESHOLDS, BADGE_UTILS } from '../config/BadgeConfig.js'

/**
 * Ghost Badge - User has no posts
 */
export class GhostBadge extends BadgeEvaluator {
  constructor() {
    super({
      id: 'ghost',
      name: 'Ghost',
      emoji: '👻',
      description: 'Silent observer - no posts detected',
      category: 'ACTIVITY',
      priority: 10
    })
  }

  async evaluate(userData, analytics) {
    return analytics.activity.totalPosts === 0
  }
}

/**
 * Newbie Badge - Less than 5 posts total
 */
export class NewbieBadge extends BadgeEvaluator {
  constructor() {
    super({
      id: 'newbie',
      name: 'Newbie',
      emoji: '🌱',
      description: 'Just getting started on the journey',
      category: 'ACTIVITY',
      priority: 8
    })
  }

  async evaluate(userData, analytics) {
    return analytics.activity.totalPosts > 0 && 
           analytics.activity.totalPosts < ACTIVITY_THRESHOLDS.NEWBIE_MAX_POSTS
  }
}

/**
 * Sky Addict Badge - Posts more than 5 times per day on average
 */
export class SkyAddictBadge extends BadgeEvaluator {
  constructor() {
    super({
      id: 'sky_addict',
      name: 'Sky Addict',
      emoji: '🔥',
      description: 'Lives and breathes Bluesky - posts constantly',
      category: 'ACTIVITY',
      priority: 7
    })
  }

  async evaluate(userData, analytics) {
    return analytics.activity.avgPostsPerDay > ACTIVITY_THRESHOLDS.SKY_ADDICT_POSTS_PER_DAY
  }
}

/**
 * Weekend Poster Badge - 80% of posts happen on weekends
 */
export class WeekendPosterBadge extends BadgeEvaluator {
  constructor() {
    super({
      id: 'weekend_poster',
      name: 'Weekend Poster',
      emoji: '🎉',
      description: 'Saves all the energy for Saturday and Sunday',
      category: 'ACTIVITY',
      priority: 5
    })
  }

  async evaluate(userData, analytics) {
    return analytics.temporal.weekendPercentage >= ACTIVITY_THRESHOLDS.WEEKEND_POSTER_PERCENTAGE
  }
}

/**
 * Daily Grinder Badge - Posts every single day
 */
export class DailyGrinderBadge extends BadgeEvaluator {
  constructor() {
    super({
      id: 'daily_grinder',
      name: 'Daily Grinder',
      emoji: '⚡',
      description: 'Never misses a day - consistency champion',
      category: 'ACTIVITY',
      priority: 9
    })
  }

  async evaluate(userData, analytics) {
    // Check if user has posted in the last 7 days consecutively
    // This is a simplified version - production would be more sophisticated
    return analytics.activity.postingConsistency > 0.8 && 
           analytics.activity.avgPostsPerDay > 0.8
  }
}

/**
 * Comeback Kid Badge - Long gap (>30 days) then resumed posting
 */
export class ComebackKidBadge extends BadgeEvaluator {
  constructor() {
    super({
      id: 'comeback_kid',
      name: 'Comeback Kid',
      emoji: '🎭',
      description: 'Disappeared for a while, then made a triumphant return',
      category: 'ACTIVITY',
      priority: 6
    })
  }

  async evaluate(userData, analytics) {
    return analytics.activity.longestGapDays > ACTIVITY_THRESHOLDS.COMEBACK_GAP_DAYS &&
           analytics.activity.hasRecentActivity
  }
}

/**
 * Midlife Crisis Badge - Sudden burst of posts after long silence
 */
export class MidlifeCrisisBadge extends BadgeEvaluator {
  constructor() {
    super({
      id: 'midlife_crisis',
      name: 'Midlife Crisis',
      emoji: '🚗',
      description: 'Went from silence to posting storm overnight',
      category: 'ACTIVITY',
      priority: 4
    })
  }

  async evaluate(userData, analytics) {
    // Recent burst after silence
    return analytics.activity.postsLast7Days > analytics.activity.avgPostsPerDay * 7 * 2 &&
           analytics.patterns.hasLongSilences
  }
}

/**
 * Echo Badge - Only posts after others (mostly replies)
 */
export class EchoBadge extends BadgeEvaluator {
  constructor() {
    super({
      id: 'echo',
      name: 'Echo',
      emoji: '🔁',
      description: 'Rarely starts conversations, prefers to join them',
      category: 'ACTIVITY',
      priority: 5
    })
  }

  async evaluate(userData, analytics) {
    return analytics.content.repliesPercentage > 80 && 
           analytics.activity.totalPosts > 5 // Need some activity to qualify
  }
}

/**
 * Time Traveler Badge - Posts at completely random hours
 */
export class TimeTravelerBadge extends BadgeEvaluator {
  constructor() {
    super({
      id: 'time_traveler',
      name: 'Time Traveler',
      emoji: '⏰',
      description: 'Posts across all hours like time zones mean nothing',
      category: 'ACTIVITY',
      priority: 3
    })
  }

  async evaluate(userData, analytics) {
    // Active across many different hours (high hour spread)
    return analytics.temporal.hourSpread >= 16 && 
           analytics.activity.totalPosts > 10
  }
}

/**
 * Sky Tourist Badge - Posted once then vanished
 */
export class SkyTouristBadge extends BadgeEvaluator {
  constructor() {
    super({
      id: 'sky_tourist',
      name: 'Sky Tourist',
      emoji: '📸',
      description: 'Took one look around and left',
      category: 'ACTIVITY',
      priority: 8
    })
  }

  async evaluate(userData, analytics) {
    const daysSinceLastPost = analytics.metadata.analysisWindow
    return analytics.activity.totalPosts === 1 && daysSinceLastPost > 7
  }
}

// Export all activity badges
export const ACTIVITY_BADGES = [
  GhostBadge,
  NewbieBadge, 
  SkyAddictBadge,
  WeekendPosterBadge,
  DailyGrinderBadge,
  ComebackKidBadge,
  MidlifeCrisisBadge,
  EchoBadge,
  TimeTravelerBadge,
  SkyTouristBadge
]