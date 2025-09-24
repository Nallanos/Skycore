import express from 'express'
import { calculateSkyScore, getArchetype, calculateSkyScoreWithBadges } from '../services/skyScoreService.js'
import { generateScoreCard } from '../services/imageService.js'
import { sendSkyScoreEmail } from '../services/emailService.js'
import { saveUser, getUserByEmailAndHandle } from '../database/init.js'

const router = express.Router()

// Validation helper
const validateInput = (email, blueskyHandle) => {
  const errors = []
  
  if (!email || !email.includes('@')) {
    errors.push('Valid email address is required')
  }
  
  if (!blueskyHandle || blueskyHandle.length < 3) {
    errors.push('Bluesky handle is required')
  }
  
  // Basic handle format validation
  if (blueskyHandle && !blueskyHandle.includes('.')) {
    errors.push('Please provide a complete Bluesky handle (e.g., @username.bsky.social)')
  }
  
  return errors
}

// Main endpoint to calculate and send SkyScore
router.post('/', async (req, res) => {
  try {
    const { email, blueskyHandle } = req.body
    
    console.log(email, blueskyHandle)

    // Validate input
    const validationErrors = validateInput(email, blueskyHandle)
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validationErrors 
      })
    }
    
    // Normalize handle (remove @ if present)
    const normalizedHandle = blueskyHandle.startsWith('@') 
      ? blueskyHandle.slice(1) 
      : blueskyHandle
    
    // Check if user already exists
    const existingUser = await getUserByEmailAndHandle(email, normalizedHandle)
    if (existingUser) {
      return res.json({
        message: 'SkyScore already calculated! Check your email.',
        cached: true,
        score: existingUser.sky_score,
        archetype: existingUser.archetype
      })
    }
    
    // Calculate SkyScore with badges
    console.log(`🎯 Calculating enhanced SkyScore for ${normalizedHandle}...`)
    const scoreData = await calculateSkyScoreWithBadges(normalizedHandle)
    
    console.log(`🎯 Calculated SkyScore: ${scoreData.skyScore} (${scoreData.archetype})`)
    console.log(`🏆 Earned badges: ${scoreData.badges.length}`)
    
    // Generate score card image
    const userData = {
      email,
      blueskyHandle: `@${normalizedHandle}`,
      skyScore: scoreData.skyScore,
      archetype: scoreData.archetype,
      badges: scoreData.badges,
      metrics: scoreData.metrics
    }
    
    const imageInfo = await generateScoreCard(userData)
    console.log(`🖼️ Generated score card: ${imageInfo.imageFilename}`)
    
    // Save to database
    const savedUser = await saveUser({
      email,
      blueskyHandle: `@${normalizedHandle}`,
      skyScore: scoreData.skyScore,
      archetype: scoreData.archetype,
      imagePath: imageInfo.imagePath
    })
    
    // Send email with badges
    await sendSkyScoreEmail(userData, imageInfo)
    
    res.json({
      success: true,
      message: 'SkyScore calculated successfully! Check your email.',
      score: scoreData.skyScore,
      archetype: scoreData.archetype,
      badges: scoreData.badges.map(b => ({ name: b.name, emoji: b.emoji })),
      badgeCount: scoreData.badges.length,
      imageUrl: imageInfo.imageUrl
    })
    
  } catch (error) {
    console.error('SkyScore calculation error:', error)
    res.status(500).json({ 
      error: 'Failed to calculate SkyScore. Please try again later.' 
    })
  }
})

// Test endpoint for badges without email (for demonstration)
router.post('/test', async (req, res) => {
  try {
    const { email, blueskyHandle } = req.body
    
    console.log('🧪 Testing badge system for:', email, blueskyHandle)

    // Validate input
    const validationErrors = validateInput(email, blueskyHandle)
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validationErrors 
      })
    }
    
    // Normalize handle (remove @ if present)
    const normalizedHandle = blueskyHandle.startsWith('@') 
      ? blueskyHandle.slice(1) 
      : blueskyHandle
    
    // Calculate SkyScore with badges (no email)
    console.log(`🎯 Calculating enhanced SkyScore for ${normalizedHandle}...`)
    const scoreData = await calculateSkyScoreWithBadges(normalizedHandle)
    
    console.log(`🎯 Calculated SkyScore: ${scoreData.skyScore} (${scoreData.archetype})`)
    console.log(`🏆 Earned badges: ${scoreData.badges.length}`)
    
    res.json({
      success: true,
      message: 'SkyScore calculated successfully with badges!',
      score: scoreData.skyScore,
      archetype: scoreData.archetype,
      badges: scoreData.badges,
      badgeCount: scoreData.badges.length,
      metrics: scoreData.metrics,
      insights: scoreData.insights,
      metadata: scoreData.metadata
    })
    
  } catch (error) {
    console.error('SkyScore calculation error:', error)
    res.status(500).json({ 
      error: 'Failed to calculate SkyScore. Please try again later.',
      details: error.message
    })
  }
})

router.get('/user/:email/:handle', async (req, res) => {
  try {
    const { email, handle } = req.params
    const user = await getUserByEmailAndHandle(email, handle)
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    res.json({
      email: user.email,
      blueskyHandle: user.bluesky_handle,
      skyScore: user.sky_score,
      archetype: user.archetype,
      createdAt: user.created_at
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    res.status(500).json({ error: 'Failed to fetch user data' })
  }
})

export default router