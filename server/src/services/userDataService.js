/**
 * User Data Service - Mock implementation for MVP
 * In production, this would integrate with real Bluesky API
 */

/**
 * Mock user data generator for MVP testing
 * This simulates real Bluesky API data with realistic patterns
 */
export class UserDataService {
  constructor() {
    this.cache = new Map()
    this.cacheExpiry = 24 * 60 * 60 * 1000 // 24 hours
  }

  /**
   * Collect comprehensive user data (mock implementation)
   * @param {string} blueskyHandle - User's Bluesky handle
   * @returns {Object} Complete user data structure
   */
  async collectUserData(blueskyHandle) {
    // Check cache first
    const cacheKey = `user_${blueskyHandle}`
    const cached = this.cache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      console.log(`📋 Using cached data for ${blueskyHandle}`)
      return cached.data
    }

    console.log(`📊 Collecting user data for ${blueskyHandle}`)
    
    // Generate mock data with realistic patterns
    const userData = {
      profile: await this.getProfile(blueskyHandle),
      posts: await this.getPosts(blueskyHandle),
      interactions: await this.getInteractions(blueskyHandle),
      metadata: {
        collectedAt: new Date().toISOString(),
        handle: blueskyHandle
      }
    }

    // Cache the result
    this.cache.set(cacheKey, {
      data: userData,
      timestamp: Date.now()
    })

    return userData
  }

  /**
   * Get user profile information (mock)
   */
  async getProfile(blueskyHandle) {
    // Simulate different user types with varying characteristics
    const userTypes = ['newbie', 'active', 'lurker', 'influencer', 'bot']
    const userType = userTypes[Math.floor(Math.random() * userTypes.length)]
    
    const profiles = {
      newbie: {
        followers: Math.floor(Math.random() * 50),
        following: Math.floor(Math.random() * 100) + 20,
        postsCount: Math.floor(Math.random() * 10),
        joinedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      active: {
        followers: Math.floor(Math.random() * 500) + 100,
        following: Math.floor(Math.random() * 300) + 50,
        postsCount: Math.floor(Math.random() * 500) + 100,
        joinedDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      },
      lurker: {
        followers: Math.floor(Math.random() * 100),
        following: Math.floor(Math.random() * 1000) + 200,
        postsCount: Math.floor(Math.random() * 20),
        joinedDate: new Date(Date.now() - Math.random() * 200 * 24 * 60 * 60 * 1000).toISOString(),
      },
      influencer: {
        followers: Math.floor(Math.random() * 5000) + 1000,
        following: Math.floor(Math.random() * 500) + 100,
        postsCount: Math.floor(Math.random() * 2000) + 500,
        joinedDate: new Date(Date.now() - Math.random() * 500 * 24 * 60 * 60 * 1000).toISOString(),
      },
      bot: {
        followers: Math.floor(Math.random() * 20),
        following: Math.floor(Math.random() * 50),
        postsCount: Math.floor(Math.random() * 1000) + 200,
        joinedDate: new Date(Date.now() - Math.random() * 100 * 24 * 60 * 60 * 1000).toISOString(),
      }
    }

    return {
      handle: blueskyHandle,
      displayName: `User ${blueskyHandle}`,
      bio: `Mock bio for ${blueskyHandle}`,
      userType, // For debugging/testing purposes
      ...profiles[userType]
    }
  }

  /**
   * Get user posts with timestamps and engagement (mock)
   */
  async getPosts(blueskyHandle) {
    const profile = await this.getProfile(blueskyHandle)
    const posts = []
    
    // Generate posts based on user type
    const postCount = Math.min(profile.postsCount, 100) // Limit for performance
    
    for (let i = 0; i < postCount; i++) {
      const daysAgo = Math.floor(Math.random() * 30) // Last 30 days
      const hour = this.generateRealisticHour(profile.userType)
      const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
      date.setHours(hour, Math.floor(Math.random() * 60), 0, 0)

      posts.push({
        id: `post_${i}`,
        text: this.generatePostText(profile.userType),
        createdAt: date.toISOString(),
        likes: this.generateEngagement(profile.userType, 'likes'),
        replies: this.generateEngagement(profile.userType, 'replies'),
        reposts: this.generateEngagement(profile.userType, 'reposts'),
        isReply: Math.random() < this.getReplyProbability(profile.userType),
        hasLinks: Math.random() < 0.2, // 20% posts have links
        hasEmojis: Math.random() < 0.6, // 60% posts have emojis
        hashtagCount: Math.floor(Math.random() * 4), // 0-3 hashtags
      })
    }

    return posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  /**
   * Get interaction patterns (mock)
   */
  async getInteractions(blueskyHandle) {
    const posts = await this.getPosts(blueskyHandle)
    
    return {
      totalLikes: posts.reduce((sum, post) => sum + post.likes, 0),
      totalReplies: posts.reduce((sum, post) => sum + post.replies, 0),
      totalReposts: posts.reduce((sum, post) => sum + post.reposts, 0),
      repliesGiven: Math.floor(Math.random() * posts.length * 2),
      likesGiven: Math.floor(Math.random() * posts.length * 10),
      mentionsCount: Math.floor(Math.random() * posts.length * 0.5),
    }
  }

  /**
   * Generate realistic posting hours based on user type
   */
  generateRealisticHour(userType) {
    const patterns = {
      newbie: () => 8 + Math.floor(Math.random() * 12), // 8 AM - 8 PM
      active: () => Math.floor(Math.random() * 24), // Any time
      lurker: () => 18 + Math.floor(Math.random() * 6), // 6 PM - 12 AM
      influencer: () => {
        // Peak hours: 9-11 AM, 6-9 PM
        return Math.random() < 0.5 ? 
          9 + Math.floor(Math.random() * 3) : 
          18 + Math.floor(Math.random() * 4)
      },
      bot: () => Math.floor(Math.random() * 24), // Random, no human pattern
    }
    
    return patterns[userType] ? patterns[userType]() : Math.floor(Math.random() * 24)
  }

  /**
   * Generate post text based on user type
   */
  generatePostText(userType) {
    const templates = {
      newbie: [
        "Just joined Bluesky! Still figuring things out 😅",
        "Hello world! First post here",
        "Learning how this works...",
        "Anyone have tips for new users?",
      ],
      active: [
        "Just had an amazing coffee this morning ☕",
        "Working on some exciting projects today!",
        "Beautiful sunset tonight 🌅",
        "Love this community already!",
        "Sharing some thoughts on today's events...",
      ],
      lurker: [
        "Rare post from me 👻",
        "Finally posting something...",
        "Breaking my silence",
      ],
      influencer: [
        "Here's my take on the latest trends...",
        "Excited to share this breakthrough with you all!",
        "Thanks for all the support, community! 🙏",
        "Thread: Let me explain why this matters... 1/",
      ],
      bot: [
        "Automated update: System running normally",
        "Daily reminder: Stay hydrated! 💧",
        "Random fact #" + Math.floor(Math.random() * 1000),
      ]
    }
    
    const userTemplates = templates[userType] || templates.active
    const template = userTemplates[Math.floor(Math.random() * userTemplates.length)]
    
    // Add random emojis and hashtags sometimes
    if (Math.random() < 0.3) {
      return template + " #bluesky #social"
    }
    
    return template
  }

  /**
   * Generate engagement numbers based on user type
   */
  generateEngagement(userType, metric) {
    const multipliers = {
      newbie: { likes: 2, replies: 1, reposts: 0.5 },
      active: { likes: 10, replies: 3, reposts: 2 },
      lurker: { likes: 1, replies: 0.5, reposts: 0.2 },
      influencer: { likes: 50, replies: 15, reposts: 10 },
      bot: { likes: 1, replies: 0.1, reposts: 0.1 },
    }
    
    const base = multipliers[userType]?.[metric] || 1
    return Math.floor(Math.random() * base * 3) // Random variation
  }

  /**
   * Get reply probability based on user type
   */
  getReplyProbability(userType) {
    const probabilities = {
      newbie: 0.1,      // 10% replies
      active: 0.3,      // 30% replies
      lurker: 0.05,     // 5% replies
      influencer: 0.2,  // 20% replies
      bot: 0.02,        // 2% replies
    }
    
    return probabilities[userType] || 0.2
  }

  /**
   * Clear cache (for testing)
   */
  clearCache() {
    this.cache.clear()
  }
}