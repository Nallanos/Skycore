import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'

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
  
  try {
    const transporter = createTransporter()
    
    if (!transporter) {
      throw new Error('No email configuration found. Please configure EMAIL_USER and EMAIL_PASSWORD in .env file or use a production email service (RESEND_API_KEY, BREVO_API_KEY, etc.)')
    }
    
    // Production email sending
    console.log(`📧 Sending production email to: ${email}`)
    
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