-- Add full-text search indexes for enhanced search capabilities
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Drop existing indexes if they exist
DROP INDEX IF EXISTS jobs_search_idx;
DROP INDEX IF EXISTS candidate_search_idx;

-- Create enhanced full-text search indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS jobs_fts_idx 
ON jobs USING GIN (to_tsvector('english', 
  COALESCE(title, '') || ' ' || 
  COALESCE(description, '') || ' ' || 
  COALESCE(location, '') || ' ' ||
  COALESCE(experience, '') || ' ' ||
  array_to_string(COALESCE(skills, '{}'), ' ')
));

CREATE INDEX CONCURRENTLY IF NOT EXISTS candidate_fts_idx 
ON candidate_profiles USING GIN (to_tsvector('english', 
  COALESCE("resumeText", '') || ' ' || 
  COALESCE("fullName", '') || ' ' || 
  COALESCE(location, '') || ' ' ||
  COALESCE(experience, '') || ' ' ||
  array_to_string(COALESCE(skills, '{}'), ' ')
));

-- Create indexes for structured filtering
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_candidates_skills 
ON candidate_profiles USING GIN (skills);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_candidates_experience 
ON candidate_profiles (experience);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_candidates_location 
ON candidate_profiles (location);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_candidates_employment_type 
ON candidate_profiles ("employmentType");

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_skills 
ON jobs USING GIN (skills);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_experience 
ON jobs (experience);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_location 
ON jobs (location);

-- Create composite indexes for common query patterns
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_candidates_skills_experience 
ON candidate_profiles (experience, skills);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_company_created 
ON jobs ("companyId", "createdAt" DESC);

-- Add trigram indexes for fuzzy matching
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_candidates_name_trgm 
ON candidate_profiles USING GIN ("fullName" gin_trgm_ops);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_title_trgm 
ON jobs USING GIN (title gin_trgm_ops);
