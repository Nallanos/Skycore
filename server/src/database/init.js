import sqlite3 from 'sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dbPath = path.join(__dirname, '../../database/skycore.db')

// Create database connection
const db = new sqlite3.Database(dbPath)

export const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT NOT NULL,
          bluesky_handle TEXT NOT NULL,
          sky_score INTEGER NOT NULL,
          archetype TEXT NOT NULL,
          image_path TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(email, bluesky_handle)
        )
      `, (err) => {
        if (err) {
          console.error('Error creating users table:', err)
          reject(err)
        } else {
          console.log('✅ Database initialized successfully')
          resolve()
        }
      })
    })
  })
}

export const saveUser = (userData) => {
  return new Promise((resolve, reject) => {
    const { email, blueskyHandle, skyScore, archetype, imagePath } = userData
    
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO users (email, bluesky_handle, sky_score, archetype, image_path)
      VALUES (?, ?, ?, ?, ?)
    `)
    
    stmt.run([email, blueskyHandle, skyScore, archetype, imagePath], function(err) {
      if (err) {
        reject(err)
      } else {
        resolve({ id: this.lastID, ...userData })
      }
    })
    
    stmt.finalize()
  })
}

export const getUserByEmailAndHandle = (email, blueskyHandle) => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM users WHERE email = ? AND bluesky_handle = ?',
      [email, blueskyHandle],
      (err, row) => {
        if (err) {
          reject(err)
        } else {
          resolve(row)
        }
      }
    )
  })
}

export const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM users ORDER BY created_at DESC', (err, rows) => {
      if (err) {
        reject(err)
      } else {
        resolve(rows)
      }
    })
  })
}

export { db }