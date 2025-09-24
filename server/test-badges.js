/**
 * Test script for badge system
 * Run this to verify badges are working correctly
 */

import { calculateSkyScoreWithBadges } from './src/services/skyScoreService.js'

async function testBadges() {
  console.log('🧪 Testing badge system...\n')
  
  const testHandles = [
    'test.user1.bsky.social',
    'test.user2.bsky.social', 
    'test.user3.bsky.social'
  ]
  
  for (const handle of testHandles) {
    console.log(`\n📊 Testing ${handle}`)
    console.log('='.repeat(50))
    
    try {
      const result = await calculateSkyScoreWithBadges(handle)
      
      console.log(`Sky Score: ${result.skyScore}`)
      console.log(`Archetype: ${result.archetype}`)
      console.log(`Badges Earned: ${result.badges.length}`)
      
      if (result.badges.length > 0) {
        console.log('\n🏆 Badges:')
        result.badges.forEach(badge => {
          console.log(`  ${badge.emoji} ${badge.name} - ${badge.description}`)
        })
      }
      
      console.log('\n📈 Metrics:')
      console.log(`  Posts: ${result.metrics.totalPosts || 0}`)
      console.log(`  Avg Posts/Day: ${result.metrics.avgPostsPerDay || 0}`)
      console.log(`  Personality: ${result.insights.personality}`)
      
    } catch (error) {
      console.error(`❌ Error testing ${handle}:`, error.message)
    }
  }
  
  console.log('\n✅ Badge system test complete!')
}

// Run the test
testBadges().catch(console.error)