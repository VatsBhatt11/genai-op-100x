-- Enable full-text search extension
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create indexes for full-text search
CREATE INDEX CONCURRENTLY IF NOT EXISTS jobs_search_idx 
ON jobs USING GIN (to_tsvector('english', title || ' ' || description || ' ' || array_to_string(skills, ' ')));

CREATE INDEX CONCURRENTLY IF NOT EXISTS candidate_search_idx 
ON candidate_profiles USING GIN (to_tsvector('english', "rawResumeText"));

-- Create indexes for performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_applications_job_candidate 
ON applications (job_id, candidate_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_applications_created_at 
ON applications (created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_company_created 
ON jobs (company_id, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_message_logs_application 
ON message_logs (application_id, created_at DESC);
