// SkyScore calculation logic based on the plan
export const calculateSkyScore = (blueskyHandle) => {
  // MVP version: 50 + Random(-20 to +20)
  // In production, this would integrate with Bluesky API for real data
  const baseScore = 50
  const randomVariation = Math.floor(Math.random() * 41) - 20 // -20 to +20
  const score = Math.max(0, Math.min(100, baseScore + randomVariation))
  
  return score
}

export const getArchetype = (score) => {
  if (score >= 80) return "Influencer"
  if (score >= 60) return "Connector"
  if (score >= 40) return "Explorer"
  return "Rookie"
}

export const getArchetypeDescription = (archetype) => {
  const descriptions = {
    "Influencer": "You're a powerhouse on Bluesky! Your content resonates widely and drives meaningful conversations.",
    "Connector": "You excel at bringing people together and fostering community connections across the platform.",
    "Explorer": "You're actively discovering and engaging with diverse content, building your unique voice.",
    "Rookie": "You're just getting started on your Bluesky journey. Great potential ahead!"
  }
  
  return descriptions[archetype] || "Your unique Bluesky presence is developing beautifully."
}

export const getArchetypeColor = (archetype) => {
  const colors = {
    "Influencer": "#FF6B6B",  // Red
    "Connector": "#4ECDC4",   // Teal
    "Explorer": "#45B7D1",    // Blue
    "Rookie": "#96CEB4"       // Green
  }
  
  return colors[archetype] || "#45B7D1"
}