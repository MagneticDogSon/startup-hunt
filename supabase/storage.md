-- Create private bucket for startup file uploads (run in Supabase SQL editor if bucket UI is used).
-- Prefer: Dashboard → Storage → New bucket → name `startup-files`, Public: OFF

-- Optional: restrict public access (default for private buckets)
-- Files are accessed via service role from Next.js API routes only.
