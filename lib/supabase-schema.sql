-- ==============================================
-- ARMATH ARAPI - Supabase Database Schema
-- ==============================================
-- Run this in your Supabase SQL Editor to create the tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Student Applications Table
CREATE TABLE IF NOT EXISTS student_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_name VARCHAR(100) NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 10 AND age <= 17),
  parent_contact VARCHAR(50) NOT NULL,
  interests TEXT DEFAULT '',
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'interviewed', 'accepted', 'rejected')),
  language VARCHAR(2) DEFAULT 'en' CHECK (language IN ('en', 'hy')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Support Requests Table
CREATE TABLE IF NOT EXISTS support_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  support_type VARCHAR(20) NOT NULL CHECK (support_type IN ('workshop', 'equipment', 'financial', 'mentoring')),
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'completed')),
  language VARCHAR(2) DEFAULT 'en' CHECK (language IN ('en', 'hy')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'completed')),
  language VARCHAR(2) DEFAULT 'en' CHECK (language IN ('en', 'hy')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_student_applications_status ON student_applications(status);
CREATE INDEX IF NOT EXISTS idx_student_applications_created_at ON student_applications(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_support_requests_status ON support_requests(status);
CREATE INDEX IF NOT EXISTS idx_support_requests_created_at ON support_requests(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);

-- Row Level Security (RLS) Policies
-- Enable RLS on all tables
ALTER TABLE student_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Policy: Allow inserts from anyone (for form submissions)
CREATE POLICY "Allow public inserts" ON student_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public inserts" ON support_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public inserts" ON contact_messages FOR INSERT WITH CHECK (true);

-- Policy: Allow all operations with service role key (for admin)
CREATE POLICY "Allow service role full access" ON student_applications FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role full access" ON support_requests FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role full access" ON contact_messages FOR ALL USING (auth.role() = 'service_role');

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
CREATE TRIGGER update_student_applications_updated_at
  BEFORE UPDATE ON student_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_requests_updated_at
  BEFORE UPDATE ON support_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_messages_updated_at
  BEFORE UPDATE ON contact_messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

