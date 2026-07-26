-- Enable pg_trgm extension for fuzzy text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create GIN index on User.username for ILIKE '%term%' queries
-- pg_trgm enables trigram-based indexing which supports wildcard LIKE/ILIKE searches
CREATE INDEX IF NOT EXISTS "User_username_trgm_idx"
ON "User" USING gin ("username" gin_trgm_ops);
