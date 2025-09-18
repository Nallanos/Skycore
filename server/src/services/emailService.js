import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'

// For MVP, we'll use a simple email service
// In production, you'd use services like Brevo, Mailgun, or Resend
const createTransporter = () => {
  // Using Gmail for MVP (you'd need to set up app password)
  // For production, use proper email service providers
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'demo@skylume.com',
      pass: process.env.EMAIL_PASSWORD || 'demo-password'
    }
  })
}

export const sendSkyScoreEmail = async (userData, imageInfo) => {
  const { email, blueskyHandle, skyScore, archetype } = userData
  const { imagePath, imageFilename } = imageInfo
  
  try {
    // For MVP, we'll simulate email sending
    console.log(`📧 Simulating email send to: ${email}`)
    console.log(`📊 SkyScore: ${skyScore} | Archetype: ${archetype}`)
    console.log(`🖼️ Image generated: ${imageFilename}`)
    
    // In production, uncomment this to actually send emails:
    /*
    const transporter = createTransporter()
    
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
    console.log('Email sent successfully:', result.messageId)
    */
    
    return { success: true, message: 'Email sent successfully (simulated)' }
  } catch (error) {
    console.error('Email sending failed:', error)
    throw new Error('Failed to send email')
  }
}