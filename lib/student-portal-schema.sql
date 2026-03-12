-- ==============================================
-- ARMATH ARAPI - Student Portal Schema
-- ==============================================
-- Run this in your Supabase SQL Editor AFTER the base schema

-- Enrolled Students Table
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  age INTEGER CHECK (age >= 10 AND age <= 17),
  parent_contact VARCHAR(50),
  email VARCHAR(255),
  language VARCHAR(2) DEFAULT 'en' CHECK (language IN ('en', 'hy')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated')),
  must_change_password BOOLEAN DEFAULT true,
  application_id UUID REFERENCES student_applications(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student Sessions Table (server-side session store)
CREATE TABLE IF NOT EXISTS student_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exclusive Student Materials Table
CREATE TABLE IF NOT EXISTS student_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content_url TEXT,
  material_slug VARCHAR(255),
  topic VARCHAR(50) CHECK (topic IN ('programming', 'electronics', 'robotics', 'modeling3d', 'cncLaser')),
  difficulty VARCHAR(20) DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'next', 'advanced')),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Material Assignments (which students get which materials)
CREATE TABLE IF NOT EXISTS student_material_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  material_id UUID NOT NULL REFERENCES student_materials(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  due_date TIMESTAMP WITH TIME ZONE,
  UNIQUE(student_id, material_id)
);

-- Student Progress Table
CREATE TABLE IF NOT EXISTS student_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  material_id UUID NOT NULL REFERENCES student_materials(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  progress_percent INTEGER DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  score INTEGER CHECK (score >= 0 AND score <= 100),
  last_position TEXT,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  time_spent_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, material_id)
);

-- Student Works Table (uploaded files)
CREATE TABLE IF NOT EXISTS student_works (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  material_id UUID REFERENCES student_materials(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size INTEGER NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN ('submitted', 'reviewed', 'needs_revision', 'approved')),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Work Feedback Table
CREATE TABLE IF NOT EXISTS student_work_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  work_id UUID NOT NULL REFERENCES student_works(id) ON DELETE CASCADE,
  author_role VARCHAR(20) DEFAULT 'admin' CHECK (author_role IN ('admin', 'student')),
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student Notifications Table
CREATE TABLE IF NOT EXISTS student_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('material_assigned', 'feedback_received', 'work_reviewed', 'announcement')),
  title VARCHAR(255) NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  related_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- Indexes
-- ==============================================

CREATE INDEX IF NOT EXISTS idx_students_username ON students(username);
CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);
CREATE INDEX IF NOT EXISTS idx_students_created_at ON students(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_student_sessions_token_hash ON student_sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_student_sessions_expires_at ON student_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_student_sessions_student_id ON student_sessions(student_id);

CREATE INDEX IF NOT EXISTS idx_student_materials_topic ON student_materials(topic);
CREATE INDEX IF NOT EXISTS idx_student_materials_order ON student_materials(order_index);

CREATE INDEX IF NOT EXISTS idx_student_material_assignments_student ON student_material_assignments(student_id);
CREATE INDEX IF NOT EXISTS idx_student_material_assignments_material ON student_material_assignments(material_id);

CREATE INDEX IF NOT EXISTS idx_student_progress_student ON student_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_material ON student_progress(material_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_status ON student_progress(status);

CREATE INDEX IF NOT EXISTS idx_student_works_student ON student_works(student_id);
CREATE INDEX IF NOT EXISTS idx_student_works_status ON student_works(status);
CREATE INDEX IF NOT EXISTS idx_student_works_submitted ON student_works(submitted_at DESC);

CREATE INDEX IF NOT EXISTS idx_student_work_feedback_work ON student_work_feedback(work_id);

CREATE INDEX IF NOT EXISTS idx_student_notifications_student ON student_notifications(student_id);
CREATE INDEX IF NOT EXISTS idx_student_notifications_unread ON student_notifications(student_id, is_read);
CREATE INDEX IF NOT EXISTS idx_student_notifications_created ON student_notifications(created_at DESC);

-- ==============================================
-- Row Level Security
-- ==============================================

ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_material_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_works ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_work_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_notifications ENABLE ROW LEVEL SECURITY;

-- Service role full access on all student tables
CREATE POLICY "Allow service role full access" ON students FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role full access" ON student_sessions FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role full access" ON student_materials FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role full access" ON student_material_assignments FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role full access" ON student_progress FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role full access" ON student_works FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role full access" ON student_work_feedback FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role full access" ON student_notifications FOR ALL USING (auth.role() = 'service_role');

-- ==============================================
-- Triggers (auto-update updated_at)
-- ==============================================

CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_materials_updated_at
  BEFORE UPDATE ON student_materials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_progress_updated_at
  BEFORE UPDATE ON student_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_works_updated_at
  BEFORE UPDATE ON student_works
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
