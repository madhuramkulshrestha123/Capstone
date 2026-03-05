-- Quick Migration for job_cards table
-- Execute this directly on your production database

BEGIN;

-- Add all missing columns with IF NOT EXISTS checks
ALTER TABLE job_cards ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE job_cards ADD COLUMN IF NOT EXISTS age INTEGER DEFAULT 0;
ALTER TABLE job_cards ADD COLUMN IF NOT EXISTS family_id VARCHAR(255);
ALTER TABLE job_cards ADD COLUMN IF NOT EXISTS head_of_household_name VARCHAR(255);
ALTER TABLE job_cards ADD COLUMN IF NOT EXISTS father_or_husband_name VARCHAR(255);
ALTER TABLE job_cards ADD COLUMN IF NOT EXISTS category VARCHAR(50);
ALTER TABLE job_cards ADD COLUMN IF NOT EXISTS epic_number VARCHAR(50);
ALTER TABLE job_cards ADD COLUMN IF NOT EXISTS belongs_to_bpl BOOLEAN DEFAULT false;
ALTER TABLE job_cards ADD COLUMN IF NOT EXISTS state VARCHAR(100);
ALTER TABLE job_cards ADD COLUMN IF NOT EXISTS village VARCHAR(255);
ALTER TABLE job_cards ADD COLUMN IF NOT EXISTS panchayat VARCHAR(255);
ALTER TABLE job_cards ADD COLUMN IF NOT EXISTS block VARCHAR(255);
ALTER TABLE job_cards ADD COLUMN IF NOT EXISTS full_address TEXT;
ALTER TABLE job_cards ADD COLUMN IF NOT EXISTS bank_name VARCHAR(255);
ALTER TABLE job_cards ADD COLUMN IF NOT EXISTS account_number VARCHAR(50);
ALTER TABLE job_cards ADD COLUMN IF NOT EXISTS ifsc_code VARCHAR(20);
ALTER TABLE job_cards ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);

-- Update existing records
UPDATE job_cards SET age = 0 WHERE age IS NULL;
UPDATE job_cards SET belongs_to_bpl = false WHERE belongs_to_bpl IS NULL;

COMMIT;

SELECT '✅ Migration completed successfully!' AS status;
