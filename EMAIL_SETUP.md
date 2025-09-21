# 📧 Production Email Setup Guide

## Quick Setup for Production Email

Your SkyScore application is now configured to work with multiple email service providers. Here's how to set up production email sending:

### 🚀 **RECOMMENDED: Resend (Easiest Setup)**

1. **Sign up** at [resend.com](https://resend.com)
2. **Verify your domain** (or use their shared domain for testing)
3. **Get your API key** from the dashboard
4. **Set environment variables**:
   ```bash
   RESEND_API_KEY=re_your-api-key-here
   EMAIL_FROM=SkyLume <noreply@yourdomain.com>
   ```

### 🔧 **Alternative: Brevo (Sendinblue)**

1. **Sign up** at [brevo.com](https://www.brevo.com)
2. **Verify your domain** and sender identity
3. **Get SMTP credentials** from settings
4. **Set environment variables**:
   ```bash
   BREVO_API_KEY=your-brevo-smtp-key
   BREVO_USER=your-verified-email@yourdomain.com
   EMAIL_FROM=SkyLume <noreply@yourdomain.com>
   ```

### 📈 **Alternative: Mailgun**

1. **Sign up** at [mailgun.com](https://www.mailgun.com)
2. **Add and verify your domain**
3. **Get SMTP credentials**
4. **Set environment variables**:
   ```bash
   MAILGUN_API_KEY=your-mailgun-smtp-password
   MAILGUN_USER=postmaster@your-domain.mailgun.org
   EMAIL_FROM=SkyLume <noreply@yourdomain.com>
   ```

## 🔄 **Fallback Behavior**

The application automatically handles different scenarios:

- ✅ **Email credentials configured**: Sends real emails
- ⚠️ **No credentials**: Falls back to simulation mode
- 🔁 **Authentication fails**: Graceful fallback with logging

## 🧪 **Testing Email Setup**

### 1. Test with simulation (no credentials):
```bash
# No email env vars set
curl -X POST http://localhost:3001/api/skyscore \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "blueskyHandle": "@test.bsky.social"}'
```

### 2. Test with production credentials:
```bash
# Set your chosen email service env vars first
export RESEND_API_KEY=re_your-key
export EMAIL_FROM="SkyLume <noreply@yourdomain.com>"

curl -X POST http://localhost:3001/api/skyscore \
  -H "Content-Type: application/json" \
  -d '{"email": "your-real-email@gmail.com", "blueskyHandle": "@test.bsky.social"}'
```

## 🚀 **Deployment Environment Variables**

### Vercel/Netlify:
Add these in your deployment dashboard:
```
RESEND_API_KEY=re_your-key
EMAIL_FROM=SkyLume <noreply@yourdomain.com>
NODE_ENV=production
```

### Railway/Render:
```bash
RESEND_API_KEY=re_your-key
EMAIL_FROM=SkyLume <noreply@yourdomain.com>
NODE_ENV=production
DATABASE_PATH=./database/skycore.db
```

## 📊 **Email Analytics**

Most services provide:
- ✅ Delivery rates
- 📬 Open rates  
- 🔗 Click-through rates
- 🚫 Bounce/spam rates

Monitor these metrics to optimize your email content and delivery.

## 🔧 **Troubleshooting**

### "Email sending failed" errors:
1. Check your API key is correct
2. Verify your domain is authenticated
3. Check rate limits on your email service
4. Ensure EMAIL_FROM matches verified sender

### Emails going to spam:
1. Set up proper SPF/DKIM records
2. Use a verified domain (not Gmail)
3. Avoid spam trigger words
4. Include unsubscribe links

## 💡 **Pro Tips**

1. **Start with Resend**: Easiest setup, great deliverability
2. **Verify your domain**: Much better delivery rates
3. **Monitor metrics**: Track open/click rates
4. **A/B test subject lines**: Improve engagement
5. **Implement unsubscribe**: Legal requirement + good UX

---

**🎯 Current Status**: Your application will gracefully fallback to simulation if no email service is configured, making it production-ready with zero configuration!