-- ============================================================================
-- Enable Row Level Security (RLS) on ALL public tables
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================================

-- Step 1: Enable RLS on every table in the public schema
DO $$
DECLARE
  tbl RECORD;
BEGIN
  FOR tbl IN
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', tbl.tablename);
    RAISE NOTICE 'Enabled RLS on public.%', tbl.tablename;
  END LOOP;
END;
$$;

-- ============================================================================
-- Step 2: Service role bypass policy for ALL tables
-- This ensures Strapi (which connects via service_role) can still read/write
-- everything. The service_role bypasses RLS by default in Supabase, but we
-- add explicit policies as a safety net.
-- ============================================================================
DO $$
DECLARE
  tbl RECORD;
BEGIN
  FOR tbl IN
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
  LOOP
    -- Drop existing policy if it exists to avoid errors on re-run
    EXECUTE format(
      'DROP POLICY IF EXISTS "Service role full access" ON public.%I;',
      tbl.tablename
    );
    EXECUTE format(
      'CREATE POLICY "Service role full access" ON public.%I
       FOR ALL
       TO service_role
       USING (true)
       WITH CHECK (true);',
      tbl.tablename
    );
    RAISE NOTICE 'Created service_role policy on public.%', tbl.tablename;
  END LOOP;
END;
$$;

-- ============================================================================
-- Step 3: Authenticated user read access for ALL tables
-- Logged-in users (e.g., admin dashboard) can read all tables.
-- ============================================================================
DO $$
DECLARE
  tbl RECORD;
BEGIN
  FOR tbl IN
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
  LOOP
    EXECUTE format(
      'DROP POLICY IF EXISTS "Authenticated read access" ON public.%I;',
      tbl.tablename
    );
    EXECUTE format(
      'CREATE POLICY "Authenticated read access" ON public.%I
       FOR SELECT
       TO authenticated
       USING (true);',
      tbl.tablename
    );
    RAISE NOTICE 'Created authenticated read policy on public.%', tbl.tablename;
  END LOOP;
END;
$$;

-- ============================================================================
-- Step 4: Anonymous (public) read access for CONTENT tables only
-- These are the tables your frontend needs to read without authentication.
-- Add or remove table names as needed for your use case.
-- ============================================================================
DO $$
DECLARE
  content_table TEXT;
  content_tables TEXT[] := ARRAY[
    'drones',
    'matterports',
    'matterports_components',
    'files'
  ];
BEGIN
  FOREACH content_table IN ARRAY content_tables
  LOOP
    -- Only create if the table exists
    IF EXISTS (
      SELECT 1 FROM pg_tables
      WHERE schemaname = 'public' AND tablename = content_table
    ) THEN
      EXECUTE format(
        'DROP POLICY IF EXISTS "Anonymous read access" ON public.%I;',
        content_table
      );
      EXECUTE format(
        'CREATE POLICY "Anonymous read access" ON public.%I
         FOR SELECT
         TO anon
         USING (true);',
        content_table
      );
      RAISE NOTICE 'Created anon read policy on public.%', content_table;
    ELSE
      RAISE NOTICE 'Skipping % (table not found)', content_table;
    END IF;
  END LOOP;
END;
$$;

-- ============================================================================
-- Verification: List all tables and their RLS status
-- ============================================================================
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
