/**
 * Badge Factory - Instantiate and manage all badge evaluators
 * Provides centralized access to all available badges
 */

import { ACTIVITY_BADGES } from './activity/ActivityBadges.js'

export class BadgeFactory {
  constructor() {
    this.badges = new Map()
    this.categories = new Map()
    this.initializeBadges()
  }

  /**
   * Initialize all badge evaluators
   */
  initializeBadges() {
    console.log('🏭 Initializing badge factory...')
    
    // Activity badges (Phase 1 - MVP)
    this.registerBadgeCategory('ACTIVITY', ACTIVITY_BADGES)
    
    // TODO: Add other categories in future phases
    // this.registerBadgeCategory('TEMPORAL', TEMPORAL_BADGES)
    // this.registerBadgeCategory('SOCIAL', SOCIAL_BADGES)
    // this.registerBadgeCategory('CONTENT', CONTENT_BADGES)
    // etc.
    
    console.log(`✅ Badge factory initialized with ${this.badges.size} badges`)
  }

  /**
   * Register all badges from a category
   */
  registerBadgeCategory(categoryName, badgeClasses) {
    const categoryBadges = []
    
    badgeClasses.forEach(BadgeClass => {
      try {
        const badge = new BadgeClass()
        this.badges.set(badge.id, badge)
        categoryBadges.push(badge)
        
        console.log(`  ✓ Registered ${badge.name} (${badge.emoji})`)
      } catch (error) {
        console.error(`  ✗ Failed to register badge ${BadgeClass.name}:`, error.message)
      }
    })
    
    this.categories.set(categoryName, categoryBadges)
    console.log(`📂 Registered ${categoryBadges.length} badges in ${categoryName} category`)
  }

  /**
   * Get all badge evaluators
   * @returns {Array} Array of all badge evaluators
   */
  getAllEvaluators() {
    return Array.from(this.badges.values())
  }

  /**
   * Get badges by category
   * @param {string} category - Category name
   * @returns {Array} Array of badge evaluators in category
   */
  getByCategory(category) {
    return this.categories.get(category) || []
  }

  /**
   * Get specific badge by ID
   * @param {string} badgeId - Badge identifier
   * @returns {BadgeEvaluator|null} Badge evaluator or null
   */
  getBadgeById(badgeId) {
    return this.badges.get(badgeId) || null
  }

  /**
   * Get available categories
   * @returns {Array} Array of category names
   */
  getCategories() {
    return Array.from(this.categories.keys())
  }

  /**
   * Get badge statistics
   * @returns {Object} Statistics about registered badges
   */
  getStats() {
    const stats = {
      total: this.badges.size,
      categories: this.categories.size,
      byCategory: {}
    }

    this.categories.forEach((badges, category) => {
      stats.byCategory[category] = badges.length
    })

    return stats
  }

  /**
   * Evaluate all badges for a user
   * @param {Object} userData - Raw user data
   * @param {Object} analytics - Processed analytics
   * @returns {Array} Array of earned badges
   */
  async evaluateAllBadges(userData, analytics) {
    console.log(`🎯 Evaluating ${this.badges.size} badges for ${userData.profile.handle}`)
    
    const earnedBadges = []
    const evaluationPromises = []

    // Evaluate all badges concurrently
    this.badges.forEach(badge => {
      evaluationPromises.push(
        badge.checkBadge(userData, analytics)
          .then(result => {
            if (result) {
              earnedBadges.push(result)
              console.log(`  🏆 Earned: ${result.name} ${result.emoji}`)
            }
            return result
          })
          .catch(error => {
            console.error(`  ❌ Error evaluating ${badge.name}:`, error.message)
            return null
          })
      )
    })

    // Wait for all evaluations to complete
    await Promise.all(evaluationPromises)

    // Sort by priority (higher priority first)
    earnedBadges.sort((a, b) => b.priority - a.priority)

    console.log(`✅ Badge evaluation complete: ${earnedBadges.length} badges earned`)
    return earnedBadges
  }

  /**
   * Get badge metadata for all badges (for documentation/debugging)
   * @returns {Array} Array of badge metadata
   */
  getAllBadgeMetadata() {
    return this.getAllEvaluators().map(badge => badge.getMetadata())
  }
}

// Singleton instance
let factoryInstance = null

/**
 * Get the singleton badge factory instance
 * @returns {BadgeFactory} Badge factory instance
 */
export const getBadgeFactory = () => {
  if (!factoryInstance) {
    factoryInstance = new BadgeFactory()
  }
  return factoryInstance
}