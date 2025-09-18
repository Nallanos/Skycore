import { createCanvas, loadImage, registerFont, CanvasRenderingContext2D } from 'canvas'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { getArchetypeColor, getArchetypeDescription } from './skyScoreService.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const generateScoreCard = async (userData) => {
  const { email, blueskyHandle, skyScore, archetype } = userData
  
  // Create canvas
  const width = 800
  const height = 600
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')
  
  // Add roundRect support
  addRoundRectSupport(ctx)
  
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, '#667eea')
  gradient.addColorStop(1, '#764ba2')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
  
  // Add subtle pattern
  ctx.globalAlpha = 0.1
  for (let i = 0; i < width; i += 50) {
    for (let j = 0; j < height; j += 50) {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(i, j, 2, 2)
    }
  }
  ctx.globalAlpha = 1
  
  // Main content area
  const cardPadding = 60
  ctx.fillStyle = '#ffffff'
  ctx.roundRect(cardPadding, cardPadding, width - cardPadding * 2, height - cardPadding * 2, 20)
  ctx.fill()
  
  // SkyLume branding
  ctx.fillStyle = '#1DA1F2'
  ctx.font = 'bold 24px Arial'
  ctx.fillText('SkyLume', cardPadding + 30, cardPadding + 45)
  
  // Logo placeholder (simple circle)
  ctx.beginPath()
  ctx.arc(cardPadding + 30 + 120, cardPadding + 32, 12, 0, 2 * Math.PI)
  ctx.fillStyle = '#1DA1F2'
  ctx.fill()
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 12px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('S', cardPadding + 30 + 120, cardPadding + 37)
  
  // User handle
  ctx.fillStyle = '#14171A'
  ctx.font = '20px Arial'
  ctx.textAlign = 'left'
  ctx.fillText(blueskyHandle, cardPadding + 30, cardPadding + 100)
  
  // SkyScore - large display
  ctx.fillStyle = getArchetypeColor(archetype)
  ctx.font = 'bold 120px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(skyScore.toString(), width / 2, cardPadding + 250)
  
  // "SkyScore" label
  ctx.fillStyle = '#657786'
  ctx.font = '24px Arial'
  ctx.fillText('SkyScore™', width / 2, cardPadding + 280)
  
  // Archetype
  ctx.fillStyle = '#14171A'
  ctx.font = 'bold 36px Arial'
  ctx.fillText(archetype, width / 2, cardPadding + 340)
  
  // Description
  const description = getArchetypeDescription(archetype)
  ctx.fillStyle = '#657786'
  ctx.font = '16px Arial'
  ctx.textAlign = 'center'
  
  // Word wrap for description
  const words = description.split(' ')
  const lines = []
  let currentLine = ''
  const maxWidth = width - cardPadding * 2 - 60
  
  for (const word of words) {
    const testLine = currentLine + word + ' '
    const metrics = ctx.measureText(testLine)
    if (metrics.width > maxWidth && currentLine !== '') {
      lines.push(currentLine.trim())
      currentLine = word + ' '
    } else {
      currentLine = testLine
    }
  }
  lines.push(currentLine.trim())
  
  // Draw description lines
  const lineHeight = 24
  const startY = cardPadding + 380
  lines.forEach((line, index) => {
    ctx.fillText(line, width / 2, startY + index * lineHeight)
  })
  
  // Footer text
  ctx.fillStyle = '#AAB8C2'
  ctx.font = '12px Arial'
  ctx.fillText('Get your SkyScore at skylume.com', width / 2, height - cardPadding - 20)
  
  // Save image
  const imageFilename = `skyscore-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.png`
  const imagePath = path.join(__dirname, '../../images', imageFilename)
  
  // Ensure images directory exists
  const imagesDir = path.join(__dirname, '../../images')
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true })
  }
  
  const buffer = canvas.toBuffer('image/png')
  fs.writeFileSync(imagePath, buffer)
  
  return {
    imagePath,
    imageFilename,
    imageUrl: `/images/${imageFilename}`
  }
}

// Helper function for rounded rectangles
const addRoundRectSupport = (ctx) => {
  if (!ctx.roundRect) {
    ctx.roundRect = function (x, y, w, h, r) {
      if (w < 2 * r) r = w / 2
      if (h < 2 * r) r = h / 2
      this.beginPath()
      this.moveTo(x + r, y)
      this.arcTo(x + w, y, x + w, y + h, r)
      this.arcTo(x + w, y + h, x, y + h, r)
      this.arcTo(x, y + h, x, y, r)
      this.arcTo(x, y, x + w, y, r)
      this.closePath()
      return this
    }
  }
}