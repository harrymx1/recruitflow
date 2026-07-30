require('dotenv').config();
const db = require('./src/config/db');

const query = `
-- Modify candidate_profiles table to add more fields
ALTER TABLE candidate_profiles 
  ADD COLUMN IF NOT EXISTS summary TEXT,
  ADD COLUMN IF NOT EXISTS phone VARCHAR(50),
  ADD COLUMN IF NOT EXISTS dob DATE,
  ADD COLUMN IF NOT EXISTS location VARCHAR(255),
  ADD COLUMN IF NOT EXISTS salary_expectation NUMERIC,
  ADD COLUMN IF NOT EXISTS notice_period VARCHAR(100),
  ADD COLUMN IF NOT EXISTS photo_url VARCHAR(255);

-- Create saved_jobs table
CREATE TABLE IF NOT EXISTS saved_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(candidate_id, job_id)
);

-- Create candidate_experiences table
CREATE TABLE IF NOT EXISTS candidate_experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  company_name VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  description TEXT,
  order_index INTEGER DEFAULT 0
);

-- Create candidate_educations table
CREATE TABLE IF NOT EXISTS candidate_educations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  institution VARCHAR(255) NOT NULL,
  degree VARCHAR(255),
  major VARCHAR(255),
  start_year INTEGER,
  end_year INTEGER,
  order_index INTEGER DEFAULT 0
);

-- Create candidate_skills table
CREATE TABLE IF NOT EXISTS candidate_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  skill_name VARCHAR(100) NOT NULL,
  UNIQUE(candidate_id, skill_name)
);

-- Create candidate_certifications table
CREATE TABLE IF NOT EXISTS candidate_certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  issuer VARCHAR(255),
  year INTEGER,
  order_index INTEGER DEFAULT 0
);

-- Create candidate_links table
CREATE TABLE IF NOT EXISTS candidate_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  url_label VARCHAR(100),
  url VARCHAR(255) NOT NULL,
  order_index INTEGER DEFAULT 0
);

-- Create candidate_documents table
CREATE TABLE IF NOT EXISTS candidate_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  label VARCHAR(100) NOT NULL,
  file_url VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
`;

db.query(query)
  .then(() => {
    console.log('Sprint 4 DB tables created/updated successfully');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error creating DB tables:', err);
    process.exit(1);
  });
