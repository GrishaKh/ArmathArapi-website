import { Resend } from 'resend'

const ADMIN_EMAIL = 'grisha.khachatrian@gmail.com'
const FROM_EMAIL = 'Armath Arapi <notifications@armath-arapi.am>' // You'll configure this in Resend

// Lazy initialization to avoid errors during build
let resend: Resend | null = null

function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    return null
  }
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY)
  }
  return resend
}

interface EmailOptions {
  subject: string
  html: string
}

export async function sendAdminNotification(options: EmailOptions) {
  const client = getResendClient()
  
  // Skip if no API key (development/build time)
  if (!client) {
    console.log('📧 Email would be sent:', options.subject)
    return { success: true, message: 'Skipped - no API key configured' }
  }

  try {
    const { data, error } = await client.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: options.subject,
      html: options.html,
    })

    if (error) {
      console.error('Email error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Email error:', error)
    return { success: false, error: 'Failed to send email' }
  }
}

// Email templates
export function studentApplicationEmail(data: {
  studentName: string
  age: string
  parentContact: string
  interests: string
  language: string
}) {
  return {
    subject: `🎓 New Student Application: ${data.studentName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #3EC1CF; border-bottom: 2px solid #E31C25; padding-bottom: 10px;">
          New Student Application
        </h1>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0; color: #333;">Student Information</h2>
          <p><strong>Name:</strong> ${data.studentName}</p>
          <p><strong>Age:</strong> ${data.age} years old</p>
          <p><strong>Parent Contact:</strong> ${data.parentContact}</p>
          <p><strong>Interests:</strong> ${data.interests || 'Not specified'}</p>
          <p><strong>Language:</strong> ${data.language === 'hy' ? 'Armenian 🇦🇲' : 'English 🇬🇧'}</p>
        </div>
        
        <p style="color: #666; font-size: 14px;">
          View all applications in the <a href="https://armath-arapi.am/admin" style="color: #3EC1CF;">Admin Dashboard</a>
        </p>
      </div>
    `,
  }
}

export function supportRequestEmail(data: {
  name: string
  email: string
  supportType: string
  message: string
  language: string
}) {
  const supportTypeLabels: Record<string, string> = {
    workshop: '📚 Host a Workshop',
    equipment: '🔧 Donate Equipment',
    financial: '💰 Financial Support',
    mentoring: '👨‍🏫 Mentoring',
  }

  return {
    subject: `💪 New Support Offer: ${supportTypeLabels[data.supportType] || data.supportType}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #3EC1CF; border-bottom: 2px solid #E31C25; padding-bottom: 10px;">
          New Support Request
        </h1>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0; color: #333;">Supporter Information</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
          <p><strong>Support Type:</strong> ${supportTypeLabels[data.supportType] || data.supportType}</p>
          <p><strong>Language:</strong> ${data.language === 'hy' ? 'Armenian 🇦🇲' : 'English 🇬🇧'}</p>
        </div>
        
        <div style="background: #fff; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h3 style="margin-top: 0;">Message:</h3>
          <p style="white-space: pre-wrap;">${data.message}</p>
        </div>
        
        <p style="color: #666; font-size: 14px; margin-top: 20px;">
          Reply directly to this email or view in <a href="https://armath-arapi.am/admin" style="color: #3EC1CF;">Admin Dashboard</a>
        </p>
      </div>
    `,
  }
}

export function contactMessageEmail(data: {
  name: string
  email: string
  message: string
  language: string
}) {
  return {
    subject: `📬 New Contact Message from ${data.name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #3EC1CF; border-bottom: 2px solid #E31C25; padding-bottom: 10px;">
          New Contact Message
        </h1>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>From:</strong> ${data.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
          <p><strong>Language:</strong> ${data.language === 'hy' ? 'Armenian 🇦🇲' : 'English 🇬🇧'}</p>
        </div>
        
        <div style="background: #fff; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h3 style="margin-top: 0;">Message:</h3>
          <p style="white-space: pre-wrap;">${data.message}</p>
        </div>
        
        <p style="color: #666; font-size: 14px; margin-top: 20px;">
          Reply directly to <a href="mailto:${data.email}" style="color: #3EC1CF;">${data.email}</a>
        </p>
      </div>
    `,
  }
}

