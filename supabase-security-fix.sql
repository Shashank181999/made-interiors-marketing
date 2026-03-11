-- =====================================================
-- SUPABASE SECURITY FIX - Run in SQL Editor
-- =====================================================

-- 1. Enable Row Level Security on all tables
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

-- 2. Create policies for the 'leads' table
-- Allow service role (your backend) full access
CREATE POLICY "Service role has full access to leads"
ON leads FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Block anonymous access (frontend can't directly access)
CREATE POLICY "Anon users cannot access leads"
ON leads FOR SELECT
TO anon
USING (false);

-- 3. Create policies for the 'email_logs' table
CREATE POLICY "Service role has full access to email_logs"
ON email_logs FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Anon users cannot access email_logs"
ON email_logs FOR SELECT
TO anon
USING (false);

-- 4. Create policies for the 'campaigns' table
CREATE POLICY "Service role has full access to campaigns"
ON campaigns FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Anon users cannot access campaigns"
ON campaigns FOR SELECT
TO anon
USING (false);

-- =====================================================
-- VERIFICATION: Run this after to confirm RLS is enabled
-- =====================================================
-- SELECT tablename, rowsecurity FROM pg_tables
-- WHERE schemaname = 'public' AND tablename IN ('leads', 'email_logs', 'campaigns');
