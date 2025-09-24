/**
 * Base class for all badge evaluators using Template Method pattern
 * Each badge must extend this class and implement the evaluate() method
 */
export class BadgeEvaluator {
  constructor({ id, name, emoji, description, category, priority = 1 }) {
    if (this.constructor === BadgeEvaluator) {
      throw new Error('BadgeEvaluator cannot be instantiated directly')
    }
    
    this.id = id
    this.name = name
    this.emoji = emoji
    this.description = description
    this.category = category
    this.priority = priority // Higher priority = more important badges
  }

  /**
   * Template method - calls abstract evaluate method and formats result
   * @param {Object} userData - User profile and analytics data
   * @param {Object} analytics - Processed user analytics
   * @returns {Object|null} Badge object if earned, null otherwise
   */
  async checkBadge(userData, analytics) {
    try {
      const earned = await this.evaluate(userData, analytics)
      
      if (earned) {
        return {
          id: this.id,
          name: this.name,
          emoji: this.emoji,
          description: this.description,
          category: this.category,
          priority: this.priority,
          earnedAt: new Date().toISOString()
        }
      }
      
      return null
    } catch (error) {
      console.error(`Error evaluating badge ${this.id}:`, error)
      return null
    }
  }

  /**
   * Abstract method - must be implemented by each badge
   * @param {Object} userData - User profile and analytics data  
   * @param {Object} analytics - Processed user analytics
   * @returns {boolean} True if badge should be awarded
   */
  async evaluate(userData, analytics) {
    throw new Error('evaluate() method must be implemented by badge subclass')
  }

  /**
   * Get badge metadata for display purposes
   * @returns {Object} Badge metadata
   */
  getMetadata() {
    return {
      id: this.id,
      name: this.name,
      emoji: this.emoji,
      description: this.description,
      category: this.category,
      priority: this.priority
    }
  }
}