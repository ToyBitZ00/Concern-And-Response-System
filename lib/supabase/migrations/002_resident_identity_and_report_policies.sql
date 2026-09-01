-- ============================================================
-- 002_resident_identity_and_report_policies
-- ============================================================
-- Purpose:
--   Allow anonymous residents to create identity verification records,
--   submit concern reports, and upload evidence without an auth user.
--   Keep read access broad enough for the resident lookup and tracking RPCs.
-- ============================================================

-- Ensure id column has a default UUID generator
ALTER TABLE public.identity_verifications
  ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Make reviewed_at nullable since it's only set when admin reviews
ALTER TABLE public.identity_verifications
  ALTER COLUMN reviewed_at DROP NOT NULL;

-- Ensure reviewed_by column exists for tracking which admin verified the resident
ALTER TABLE public.identity_verifications
  ADD COLUMN IF NOT EXISTS reviewed_by uuid;

ALTER TABLE public.identity_verifications
  ADD COLUMN IF NOT EXISTS full_name text;

ALTER TABLE public.identity_verifications
  ADD COLUMN IF NOT EXISTS age integer;

ALTER TABLE public.identity_verifications
  ADD COLUMN IF NOT EXISTS purok text;

ALTER TABLE public.identity_verifications
  ADD COLUMN IF NOT EXISTS email text;

ALTER TABLE public.identity_verifications
  ADD COLUMN IF NOT EXISTS phone text;

ALTER TABLE public.identity_verifications
  ADD COLUMN IF NOT EXISTS status text;

ALTER TABLE public.identity_verifications
  ALTER COLUMN status SET DEFAULT 'pending';

ALTER TABLE public.identity_verifications
  ALTER COLUMN created_at SET DEFAULT now();

ALTER TABLE public.identity_verifications
  ALTER COLUMN updated_at SET DEFAULT now();

ALTER TABLE public.identity_verifications
  DROP CONSTRAINT IF EXISTS identity_verifications_status_check;

ALTER TABLE public.identity_verifications
  ADD CONSTRAINT identity_verifications_status_check
  CHECK (status IN ('pending', 'verified', 'rejected')) NOT VALID;

-- Ensure reports id column has a default UUID generator
ALTER TABLE public.reports
  ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Add missing columns to reports table
ALTER TABLE public.reports
  ADD COLUMN IF NOT EXISTS evidence_url text;

ALTER TABLE public.reports
  ADD COLUMN IF NOT EXISTS location_source text;

-- Drop the old foreign key constraint that points to profiles
ALTER TABLE public.reports
  DROP CONSTRAINT IF EXISTS reports_resident_id_fkey;

-- Add new foreign key constraint pointing to identity_verifications
ALTER TABLE public.reports
  ADD CONSTRAINT reports_resident_id_fkey
  FOREIGN KEY (resident_id)
  REFERENCES public.identity_verifications(id)
  ON DELETE CASCADE;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.identity_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waste_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow users to view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow staff to view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow anonymous residents to create identity records" ON public.identity_verifications;
DROP POLICY IF EXISTS "Allow anonymous residents to look up identity records" ON public.identity_verifications;
DROP POLICY IF EXISTS "Allow anonymous residents to submit reports" ON public.reports;
DROP POLICY IF EXISTS "Allow resident report tracking lookups" ON public.reports;
DROP POLICY IF EXISTS "Allow public viewing of active categories" ON public.waste_categories;
DROP POLICY IF EXISTS "Allow anonymous residents to upload evidence" ON storage.objects;
DROP POLICY IF EXISTS "Allow resident report evidence reads" ON storage.objects;

CREATE POLICY "Allow users to view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Allow users to update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow staff to view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (role IN ('admin', 'superadmin') OR auth.uid() = id);

-- Explicitly allow the actual browser role used by anonymous residents.
CREATE POLICY "Allow anonymous residents to create identity records"
ON public.identity_verifications
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Allow anonymous residents to look up identity records"
ON public.identity_verifications
FOR SELECT
TO anon
USING (true);

-- Allow authenticated admins to update resident verification status
CREATE POLICY "Allow admins to verify resident identities"
ON public.identity_verifications
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated admins to view all resident identities
CREATE POLICY "Allow admins to view all resident identities"
ON public.identity_verifications
FOR SELECT
TO authenticated
USING (true);

-- Public report submission from resident flow.
CREATE POLICY "Allow anonymous residents to submit reports"
ON public.reports
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Allow resident report tracking lookups"
ON public.reports
FOR SELECT
TO anon
USING (true);

-- Allow authenticated admins to view and update reports
CREATE POLICY "Allow admins to view all reports"
ON public.reports
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow admins to update report status"
ON public.reports
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Public category lookup for the report form.
CREATE POLICY "Allow public viewing of active categories"
ON public.waste_categories
FOR SELECT
TO anon
USING (is_active = true);

-- Allow admins to view all waste categories
CREATE POLICY "Allow admins to view all categories"
ON public.waste_categories
FOR SELECT
TO authenticated
USING (true);

-- Storage bucket policy for resident evidence uploads.
CREATE POLICY "Allow anonymous residents to upload evidence"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (
    bucket_id = 'resident-report-evidence'
    AND true
);

CREATE POLICY "Allow resident report evidence reads"
ON storage.objects
FOR SELECT
TO anon
USING (
    bucket_id = 'resident-report-evidence'
);
