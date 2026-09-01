-- ============================================================
-- EcoGlobe
-- Waste Disposal Concern & Response System
--
-- Migration: 001_constraints_and_defaults
--
-- Purpose:
--   1. Add validation to text-based enum-like fields
--   2. Set timestamp defaults
--   3. Set waste category defaults
--   4. Prevent duplicate category names
--   5. Seed initial waste categories
--
-- FK UUID defaults were fixed separately and are intentionally
-- NOT modified in this migration.
-- ============================================================


-- ============================================================
-- 1. PROFILES
-- ============================================================

ALTER TABLE public.profiles
    ADD CONSTRAINT profiles_role_check
    CHECK (
        role IN (
            'resident',
            'admin',
            'superadmin'
        )
    );

ALTER TABLE public.profiles
    ADD CONSTRAINT profiles_verification_status_check
    CHECK (
        verification_status IN (
            'unverified',
            'pending',
            'verified',
            'rejected'
        )
    );

ALTER TABLE public.profiles
    ALTER COLUMN created_at SET DEFAULT now(),
    ALTER COLUMN updated_at SET DEFAULT now();


-- ============================================================
-- 2. IDENTITY VERIFICATIONS
-- ============================================================

ALTER TABLE public.identity_verifications
    ADD CONSTRAINT identity_verifications_status_check
    CHECK (
        status IN (
            'pending',
            'verified',
            'rejected'
        )
    );

ALTER TABLE public.identity_verifications
    ALTER COLUMN created_at SET DEFAULT now(),
    ALTER COLUMN updated_at SET DEFAULT now();


-- ============================================================
-- 3. WASTE CATEGORIES
-- ============================================================

ALTER TABLE public.waste_categories
    ALTER COLUMN is_active SET DEFAULT true;

ALTER TABLE public.waste_categories
    ALTER COLUMN created_at SET DEFAULT now();

ALTER TABLE public.waste_categories
    ADD CONSTRAINT waste_categories_name_unique
    UNIQUE (name);


-- ============================================================
-- 4. REPORTS
-- ============================================================

ALTER TABLE public.reports
    ADD CONSTRAINT reports_status_check
    CHECK (
        status IN (
            'pending',
            'in_progress',
            'resolved',
            'rejected'
        )
    );

ALTER TABLE public.reports
    ADD CONSTRAINT reports_location_source_check
    CHECK (
        location_source IS NULL
        OR location_source IN (
            'auto_estimated',
            'resident_adjusted'
        )
    );

ALTER TABLE public.reports
    ALTER COLUMN created_at SET DEFAULT now(),
    ALTER COLUMN updated_at SET DEFAULT now();


-- ============================================================
-- 5. REPORT STATUS HISTORY
-- ============================================================

ALTER TABLE public.report_status_history
    ADD CONSTRAINT report_status_history_old_status_check
    CHECK (
        old_status IS NULL
        OR old_status IN (
            'pending',
            'in_progress',
            'resolved',
            'rejected'
        )
    );

ALTER TABLE public.report_status_history
    ADD CONSTRAINT report_status_history_new_status_check
    CHECK (
        new_status IN (
            'pending',
            'in_progress',
            'resolved',
            'rejected'
        )
    );

ALTER TABLE public.report_status_history
    ALTER COLUMN created_at SET DEFAULT now();


-- ============================================================
-- 6. REPORT EVIDENCE
-- ============================================================

ALTER TABLE public.report_evidence
    ALTER COLUMN created_at SET DEFAULT now();


-- ============================================================
-- 7. INITIAL WASTE CATEGORIES
-- ============================================================

INSERT INTO public.waste_categories
    (name, description, is_active)
VALUES
    (
        'Clogged Drainage',
        'Blocked or clogged drainage systems.',
        true
    ),
    (
        'Illegal Dumping',
        'Waste disposed of in unauthorized locations.',
        true
    ),
    (
        'Uncollected Trash',
        'Garbage that has not been collected as scheduled.',
        true
    ),
    (
        'Waste Burning',
        'Improper or unauthorized burning of waste.',
        true
    ),
    (
        'Improper Waste Segregation',
        'Waste that has not been properly separated.',
        true
    ),
    (
        'Overflowing Garbage',
        'Garbage containers or collection areas that are overflowing.',
        true
    ),
    (
        'Hazardous Waste',
        'Waste that may pose health or environmental risks.',
        true
    ),
    (
        'Other',
        'Other environmental or waste-related concerns.',
        true
    )
ON CONFLICT (name) DO NOTHING;