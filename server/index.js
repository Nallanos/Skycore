import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import path from 'path'
import { fileURLToPath } from 'url'

import skyScoreRoutes from './src/routes/skyScore.js'
import { initializeDatabase } from './src/database/init.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})

// Middleware
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use('/api', limiter)

// Serve static files (generated images)
app.use('/images', express.static(path.join(__dirname, 'images')))

// Serve React build files
app.use(express.static(path.join(__dirname, 'dist')))

// Routes
app.use('/api/skyscore', skyScoreRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Debug route to check file system on Railway
app.get('/debug/files', (req, res) => {
  const fs = require('fs')
  const debug = {
    __dirname,
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT,
    currentDirectory: process.cwd()
  }
  
  try {
    debug.filesInRoot = fs.readdirSync(__dirname)
  } catch (e) {
    debug.filesInRoot = `Error: ${e.message}`
  }
  
  try {
    const distPath = path.join(__dirname, 'dist')
    debug.distExists = fs.existsSync(distPath)
    if (debug.distExists) {
      debug.filesInDist = fs.readdirSync(distPath)
    }
  } catch (e) {
    debug.distError = e.message
  }
  
  res.json(debug)
})

// Catch-all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  // Don't serve index.html for API routes or static files
  if (req.path.startsWith('/api/') || req.path.startsWith('/images/')) {
    return res.status(404).json({ error: 'Not found' })
  }
  
  const indexPath = path.join(__dirname, 'dist', 'index.html')
  
  // Check if index.html exists before trying to serve it
  const fs = require('fs')
  
  if (!fs.existsSync(indexPath)) {
    console.error('index.html not found at:', indexPath)
    console.error('__dirname:', __dirname)
    
    // List files in current directory
    try {
      const currentFiles = fs.readdirSync(__dirname)
      console.error('Files in __dirname:', currentFiles)
    } catch (e) {
      console.error('Cannot read __dirname:', e.message)
    }
    
    // Try to list dist folder if it exists
    const distPath = path.join(__dirname, 'dist')
    try {
      const distFiles = fs.readdirSync(distPath)
      console.error('Files in dist folder:', distFiles)
    } catch (e) {
      console.error('dist folder does not exist or cannot be read:', e.message)
    }
    
    return res.status(404).json({ 
      error: 'React app not found', 
      details: 'index.html missing - build may have failed',
      path: indexPath,
      suggestion: 'Check Railway build logs and ensure build.sh executed correctly'
    })
  }
  
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error serving index.html:', err)
      res.status(500).json({ error: 'Failed to serve page' })
    }
  })
})

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error)
  res.status(500).json({ error: 'Internal server error' })
})

// Initialize database and start server
async function startServer() {
  try {
    await initializeDatabase()
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`📊 SkyScore API ready at http://localhost:${PORT}/api/skyscore`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()