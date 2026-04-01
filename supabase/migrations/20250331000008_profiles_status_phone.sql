-- ============================================================================
-- Migration 008: Add status and phone columns to profiles
-- These columns were previously added manually and missing from migrations.
-- ============================================================================

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
