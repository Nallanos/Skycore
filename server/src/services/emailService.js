import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'

/**
 * Generate HTML for badges section
 */
const generateBadgesHtml = (badges) => {
  if (!badges || badges.length === 0) {
    return `
      <div style="background: white; border-radius: 12px; padding: 25px; margin: 20px 0; text-align: center;">
        <h3 style="color: #14171A; margin-top: 0;">🎯 Your Journey Starts Here</h3>
        <p style="color: #657786; margin-bottom: 0;">
          Keep posting and engaging to unlock your first badges!
        </p>
      </div>
    `
  }

  const badgeCards = badges.map(badge => `
    <div style="background: #f0f8ff; border: 2px solid #e1f5fe; border-radius: 8px; padding: 15px; margin: 8px; text-align: center; display: inline-block; min-width: 140px;">
      <div style="font-size: 32px; margin-bottom: 8px;">${badge.emoji}</div>
      <div style="font-weight: bold; color: #14171A; margin-bottom: 4px;">${badge.name}</div>
      <div style="font-size: 12px; color: #657786; line-height: 1.3;">${badge.description}</div>
    </div>
  `).join('')

  return `
    <div style="background: white; border-radius: 12px; padding: 25px; margin: 20px 0;">
      <h3 style="color: #14171A; margin-top: 0; text-align: center;">🏆 Your Badges</h3>
      <p style="color: #657786; text-align: center; margin-bottom: 20px;">
        You've earned ${badges.length} badge${badges.length === 1 ? '' : 's'} based on your Bluesky activity!
      </p>
      <div style="text-align: center; line-height: 0;">
        ${badgeCards}
      </div>
    </div>
  `
}

/**
 * Generate HTML for metrics section
 */
const generateMetricsHtml = (metrics) => {
  if (!metrics || Object.keys(metrics).length === 0) {
    return ''
  }

  const formatNumber = (num) => {
    if (num === undefined || num === null) return '0'
    return typeof num === 'number' ? Math.round(num * 10) / 10 : num
  }

  return `
    <div style="background: white; border-radius: 12px; padding: 25px; margin: 20px 0;">
      <h3 style="color: #14171A; margin-top: 0; text-align: center;">📊 Your Stats</h3>
      <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 15px;">
        
        ${metrics.totalPosts !== undefined ? `
        <div style="background: #f8f9fa; border-radius: 8px; padding: 15px; text-align: center; min-width: 100px;">
          <div style="font-size: 24px; font-weight: bold; color: #1DA1F2;">${formatNumber(metrics.totalPosts)}</div>
          <div style="font-size: 12px; color: #657786;">Posts</div>
        </div>
        ` : ''}
        
        ${metrics.avgPostsPerDay !== undefined ? `
        <div style="background: #f8f9fa; border-radius: 8px; padding: 15px; text-align: center; min-width: 100px;">
          <div style="font-size: 24px; font-weight: bold; color: #ff6b6b;">${formatNumber(metrics.avgPostsPerDay)}</div>
          <div style="font-size: 12px; color: #657786;">Posts/Day</div>
        </div>
        ` : ''}
        
        ${metrics.avgLikesPerPost !== undefined ? `
        <div style="background: #f8f9fa; border-radius: 8px; padding: 15px; text-align: center; min-width: 100px;">
          <div style="font-size: 24px; font-weight: bold; color: #4ECDC4;">${formatNumber(metrics.avgLikesPerPost)}</div>
          <div style="font-size: 12px; color: #657786;">Avg Likes</div>
        </div>
        ` : ''}
        
        ${metrics.weekendActivity !== undefined ? `
        <div style="background: #f8f9fa; border-radius: 8px; padding: 15px; text-align: center; min-width: 100px;">
          <div style="font-size: 24px; font-weight: bold; color: #45B7D1;">${formatNumber(metrics.weekendActivity)}%</div>
          <div style="font-size: 12px; color: #657786;">Weekend</div>
        </div>
        ` : ''}
        
      </div>
    </div>
  `
}

// Direct Resend API function (more reliable than SMTP)
const sendWithResendAPI = async (userData, imageInfo) => {
  const { email, blueskyHandle, skyScore, archetype, badges = [], metrics = {} } = userData
  const { imagePath, imageFilename } = imageInfo
  
  console.log('📧 Sending email via Resend API to:', email)
  console.log(`🎯 Including ${badges.length} badges and metrics in email`)
  
  // Read image file as base64
  let attachmentData = null
  if (fs.existsSync(imagePath)) {
    const imageBuffer = fs.readFileSync(imagePath)
    attachmentData = imageBuffer.toString('base64')
  }

  // Generate badges HTML
  const badgesHtml = generateBadgesHtml(badges)
  
  // Generate metrics HTML  
  const metricsHtml = generateMetricsHtml(metrics)
  
  const emailData = {
    from: process.env.EMAIL_FROM || 'SkyLume <noreply@skylume.com>',
    to: email,
    subject: `🎉 Your SkyScore is ${skyScore}! You're ${archetype === 'Influencer' ? 'an' : 'a'} ${archetype}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 32px;">Your SkyScore is Ready! 🎉</h1>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #14171A; margin-bottom: 20px;">Hey ${blueskyHandle}!</h2>
          
          <p style="color: #657786; font-size: 16px; line-height: 1.6;">
            We've analyzed your Bluesky presence and calculated your personalized SkyScore. 
            You scored <strong style="color: #1DA1F2;">${skyScore}/100</strong> and you're ${archetype === 'Influencer' ? 'an' : 'a'} <strong>${archetype}</strong>!
          </p>
          
          <div style="background: white; border-radius: 10px; padding: 30px; margin: 30px 0; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h3 style="color: #667eea; font-size: 24px; margin-bottom: 10px;">Your SkyScore</h3>
            <div style="font-size: 48px; font-weight: bold; color: #14171A; margin-bottom: 10px;">${skyScore}</div>
            <div style="color: #667eea; font-size: 18px; font-weight: bold;">${archetype}</div>
          </div>
          
          ${badgesHtml}
          
          ${metricsHtml}
          
          <div style="background: white; padding: 25px; border-radius: 12px; margin: 20px 0;">
            <h3 style="color: #14171A; margin-top: 0;">Share Your SkyScore!</h3>
            <p style="color: #657786; margin-bottom: 20px;">
              Show off your SkyScore${badges.length > 0 ? ' and badges' : ''} on Bluesky and see how you compare with friends!
            </p>
            <a href="https://bsky.app" style="display: inline-block; background: #1DA1F2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Share on Bluesky
            </a>
          </div>
          
          <p style="color: #657786; font-size: 14px; text-align: center;">
            Keep engaging, creating, and connecting to unlock more badges! 🚀
          </p>
        </div>
        
        <div style="background: #14171A; padding: 20px; text-align: center;">
          <p style="color: #AAB8C2; font-size: 12px; margin: 0;">
            © 2024 SkyLume. All rights reserved.<br>
            <a href="#" style="color: #1DA1F2;">Unsubscribe</a> | <a href="#" style="color: #1DA1F2;">Privacy Policy</a>
          </p>
        </div>
      </div>
    `,
    attachments: attachmentData ? [{
      filename: imageFilename,
      content: attachmentData,
      type: 'image/png',
      disposition: 'attachment'
    }] : []
  }
  
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(emailData)
  })
  
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Resend API error: ${response.status} - ${error}`)
  }
  
  const result = await response.json()
  console.log('✅ Email sent successfully via Resend API:', result.id)
  return result
}

// For production, use proper email service providers
const createTransporter = () => {
  // Check if we have proper production email credentials
  if (process.env.BREVO_API_KEY) {
    // Use Brevo (Sendinblue) for production
    return nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_USER || 'your-brevo-email@domain.com',
        pass: process.env.BREVO_API_KEY
      }
    })
  } else if (process.env.MAILGUN_API_KEY) {
    // Use Mailgun for production
    return nodemailer.createTransport({
      host: 'smtp.mailgun.org',
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAILGUN_USER,
        pass: process.env.MAILGUN_API_KEY
      }
    })
  } else if (process.env.RESEND_API_KEY) {
    // Use Resend for production
    return nodemailer.createTransport({
      host: 'smtp.resend.com',
      port: 587,
      secure: false,
      auth: {
        user: 'resend',
        pass: process.env.RESEND_API_KEY
      }
    })
  } else if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
    // Fallback to Gmail with app password (not recommended for production)
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    })
  } else {
    // No credentials found - will fall back to simulation
    return null
  }
}

export const sendSkyScoreEmail = async (userData, imageInfo) => {
  const { email, blueskyHandle, skyScore, archetype } = userData
  const { imagePath, imageFilename } = imageInfo
  
  // Debug logging
  console.log('🔍 Email configuration debug:')
  console.log('  RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY)
  console.log('  EMAIL_FROM:', process.env.EMAIL_FROM)
  console.log('  NODE_ENV:', process.env.NODE_ENV)
  
  try {
    // Try Resend API first (more reliable than SMTP)
    if (process.env.RESEND_API_KEY) {
      console.log('📧 Using Resend API for email sending')
      return await sendWithResendAPI(userData, imageInfo)
    }
    
    const transporter = createTransporter()
    
    if (!transporter) {
      throw new Error('No email configuration found. Please configure EMAIL_USER and EMAIL_PASSWORD in .env file or use a production email service (RESEND_API_KEY, BREVO_API_KEY, etc.)')
    }
    
    // Production email sending via SMTP
    console.log(`📧 Sending production email via SMTP to: ${email}`)
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'SkyLume <noreply@skylume.com>',
      to: email,
      subject: `🎉 Your SkyScore is ${skyScore}! You're ${archetype === 'Influencer' ? 'an' : 'a'} ${archetype}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 32px;">Your SkyScore is Ready! 🎉</h1>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #14171A; margin-bottom: 20px;">Hey ${blueskyHandle}!</h2>
            
            <p style="color: #657786; font-size: 16px; line-height: 1.6;">
              We've analyzed your Bluesky presence and calculated your personalized SkyScore. 
              You scored <strong style="color: #1DA1F2;">${skyScore}/100</strong> and you're ${archetype === 'Influencer' ? 'an' : 'a'} <strong>${archetype}</strong>!
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <img src="cid:skyscore-card" alt="Your SkyScore Card" style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
            </div>
            
            <div style="background: white; padding: 25px; border-radius: 12px; margin: 20px 0;">
              <h3 style="color: #14171A; margin-top: 0;">Share Your SkyScore!</h3>
              <p style="color: #657786; margin-bottom: 20px;">
                Show off your SkyScore on Bluesky and see how you compare with friends!
              </p>
              <a href="https://bsky.app" style="display: inline-block; background: #1DA1F2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Share on Bluesky
              </a>
            </div>
            
            <p style="color: #AAB8C2; font-size: 14px; text-align: center; margin-top: 30px;">
              Want to improve your score? Keep engaging, creating, and connecting on Bluesky!
            </p>
          </div>
          
          <div style="background: #14171A; padding: 20px; text-align: center;">
            <p style="color: #AAB8C2; font-size: 12px; margin: 0;">
              © 2024 SkyLume. All rights reserved.<br>
              <a href="#" style="color: #1DA1F2;">Unsubscribe</a> | <a href="#" style="color: #1DA1F2;">Privacy Policy</a>
            </p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: imageFilename,
          path: imagePath,
          cid: 'skyscore-card'
        }
      ]
    }
    
    const result = await transporter.sendMail(mailOptions)
    console.log('✅ Email sent successfully:', result.messageId)
    
    return { success: true, message: 'Email sent successfully', messageId: result.messageId }
    
  } catch (error) {
    console.error('❌ Email sending failed:', error)
    
    // Provide specific error messages for common issues
    if (error.code === 'EAUTH' || error.responseCode === 535) {
      throw new Error('Email authentication failed. Please check your EMAIL_USER and EMAIL_PASSWORD in .env file. For Gmail, make sure you are using an App Password.')
    }
    
    if (error.code === 'ECONNECTION' || error.code === 'ETIMEDOUT') {
      throw new Error('Unable to connect to email server. Please check your internet connection and email configuration.')
    }
    
    throw new Error(`Failed to send email: ${error.message}`)
  }
}