import express from 'express'
import { calculateSkyScore, getArchetype } from '../services/skyScoreService.js'
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
    
    // Calculate SkyScore
    const skyScore = calculateSkyScore(normalizedHandle)
    const archetype = getArchetype(skyScore)
    
    console.log(`🎯 Calculated SkyScore for ${normalizedHandle}: ${skyScore} (${archetype})`)
    
    // Generate score card image
    const userData = {
      email,
      blueskyHandle: `@${normalizedHandle}`,
      skyScore,
      archetype
    }
    
    const imageInfo = await generateScoreCard(userData)
    console.log(`🖼️ Generated score card: ${imageInfo.imageFilename}`)
    
    // Save to database
    const savedUser = await saveUser({
      ...userData,
      imagePath: imageInfo.imagePath
    })
    
    // Send email
    await sendSkyScoreEmail(userData, imageInfo)
    
    res.json({
      success: true,
      message: 'SkyScore calculated successfully! Check your email.',
      score: skyScore,
      archetype,
      imageUrl: imageInfo.imageUrl
    })
    
  } catch (error) {
    console.error('SkyScore calculation error:', error)
    res.status(500).json({ 
      error: 'Failed to calculate SkyScore. Please try again later.' 
    })
  }
})

// Get user's score (for verification/testing)
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