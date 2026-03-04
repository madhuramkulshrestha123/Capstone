-- Migration: Add tracking_id column to job_card_applications table
-- Date: 2026-03-04

-- Add tracking_id column if it doesn't exist
ALTER TABLE job_card_applications 
ADD COLUMN IF NOT EXISTS tracking_id VARCHAR(255) UNIQUE;

-- Create index on tracking_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_job_card_applications_tracking_id 
ON job_card_applications(tracking_id);

-- Note: This migration adds the tracking_id column to store the generated tracking IDs
-- Tracking IDs are in format: JC-{timestamp}-{random_number}
-- Example: JC-1772631599106-123
