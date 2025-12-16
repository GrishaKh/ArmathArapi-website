# Armath Arapi - Backend Setup Guide

## Overview

This project now includes a complete backend system for:
- **Student Applications** (Join as Student form)
- **Support Requests** (Support Armath form)
- **Contact Messages** (Contact form)

All submissions are stored in Supabase and you receive email notifications via Resend.

---

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to **SQL Editor** and run the following schema:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Student Applications Table
CREATE TABLE student_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_name VARCHAR(100) NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 10 AND age <= 17),
  parent_contact VARCHAR(50) NOT NULL,
  interests TEXT DEFAULT '',
  status VARCHAR(20) DEFAULT 'pending',
  language VARCHAR(2) DEFAULT 'en',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Support Requests Table
CREATE TABLE support_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  support_type VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  language VARCHAR(2) DEFAULT 'en',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact Messages Table
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  language VARCHAR(2) DEFAULT 'en',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE student_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (for form submissions)
CREATE POLICY "Allow public inserts" ON student_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public inserts" ON support_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public inserts" ON contact_messages FOR INSERT WITH CHECK (true);

-- Allow service role full access (for admin dashboard)
CREATE POLICY "Service role access" ON student_applications FOR ALL USING (true);
CREATE POLICY "Service role access" ON support_requests FOR ALL USING (true);
CREATE POLICY "Service role access" ON contact_messages FOR ALL USING (true);
```

4. Go to **Settings > API** and copy:
   - Project URL
   - `anon` public key
   - `service_role` secret key

---

## 2. Set Up Resend (Email Notifications)

1. Go to [resend.com](https://resend.com) and create a free account
2. Go to **API Keys** and create a new key
3. Copy the API key

**Note:** For production, you'll need to verify your domain to send from a custom email address.

---

## 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Resend
RESEND_API_KEY=re_xxxxxxxx

# Admin Dashboard
ADMIN_PASSWORD=your-secure-password
ADMIN_SESSION_SECRET=generate-a-random-string-here
```

**Generate session secret:**
```bash
openssl rand -base64 32
```

---

## 4. Deploy to Vercel

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add the environment variables in Vercel project settings
4. Deploy!

---

## 5. Admin Dashboard

Access the admin dashboard at: `https://your-domain.com/admin`

Features:
- View all submissions (students, support, contact)
- Update status (pending → contacted → accepted/rejected)
- Delete submissions
- Statistics overview

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/submissions/student` | POST | Submit student application |
| `/api/submissions/support` | POST | Submit support request |
| `/api/submissions/contact` | POST | Submit contact message |
| `/api/admin/auth` | POST/GET/DELETE | Admin authentication |
| `/api/admin/submissions` | GET/PATCH/DELETE | Manage submissions |
| `/api/admin/stats` | GET | Dashboard statistics |

---

## Email Notifications

When someone submits a form, you'll receive an email at `grisha.khachatrian@gmail.com` with:
- All submitted information
- Link to admin dashboard
- Direct reply link (for contact/support forms)

---

## Armenian Translations

You need to add Armenian translations for the new form messages in `lib/translations.ts`:

```typescript
// Add these to the `hy` section:
submitting: " Delays ...",
sending: " Delays delays ...",
applicationSubmitted: " Delays delays !",
applicationThankYou: " Delays delays delays ...",
// ... etc
```

---

## Security Features

- Rate limiting (5 requests/hour per IP for forms)
- Input validation with Zod
- Password-protected admin dashboard
- HTTP-only session cookies
- Service role key used only server-side

---

## Questions?

Contact: grisha.khachatrian@gmail.com
