-- Migration to add missing columns to job_cards table
-- Date: 2026-03-05
-- This migration adds all required columns for the job card approval flow

BEGIN;

-- Add date_of_birth column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'job_cards' AND column_name = 'date_of_birth') THEN
        ALTER TABLE job_cards ADD COLUMN date_of_birth DATE;
        RAISE NOTICE 'Column date_of_birth added to job_cards table';
    ELSE
        RAISE NOTICE 'Column date_of_birth already exists in job_cards table';
    END IF;
END $$;

-- Add age column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'job_cards' AND column_name = 'age') THEN
        ALTER TABLE job_cards ADD COLUMN age INTEGER DEFAULT 0;
        RAISE NOTICE 'Column age added to job_cards table';
    ELSE
        RAISE NOTICE 'Column age already exists in job_cards table';
    END IF;
END $$;

-- Add family_id column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'job_cards' AND column_name = 'family_id') THEN
        ALTER TABLE job_cards ADD COLUMN family_id VARCHAR(255);
        RAISE NOTICE 'Column family_id added to job_cards table';
    ELSE
        RAISE NOTICE 'Column family_id already exists in job_cards table';
    END IF;
END $$;

-- Add head_of_household_name column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'job_cards' AND column_name = 'head_of_household_name') THEN
        ALTER TABLE job_cards ADD COLUMN head_of_household_name VARCHAR(255);
        RAISE NOTICE 'Column head_of_household_name added to job_cards table';
    ELSE
        RAISE NOTICE 'Column head_of_household_name already exists in job_cards table';
    END IF;
END $$;

-- Add father_or_husband_name column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'job_cards' AND column_name = 'father_or_husband_name') THEN
        ALTER TABLE job_cards ADD COLUMN father_or_husband_name VARCHAR(255);
        RAISE NOTICE 'Column father_or_husband_name added to job_cards table';
    ELSE
        RAISE NOTICE 'Column father_or_husband_name already exists in job_cards table';
    END IF;
END $$;

-- Add category column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'job_cards' AND column_name = 'category') THEN
        ALTER TABLE job_cards ADD COLUMN category VARCHAR(50);
        RAISE NOTICE 'Column category added to job_cards table';
    ELSE
        RAISE NOTICE 'Column category already exists in job_cards table';
    END IF;
END $$;

-- Add epic_number column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'job_cards' AND column_name = 'epic_number') THEN
        ALTER TABLE job_cards ADD COLUMN epic_number VARCHAR(50);
        RAISE NOTICE 'Column epic_number added to job_cards table';
    ELSE
        RAISE NOTICE 'Column epic_number already exists in job_cards table';
    END IF;
END $$;

-- Add belongs_to_bpl column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'job_cards' AND column_name = 'belongs_to_bpl') THEN
        ALTER TABLE job_cards ADD COLUMN belongs_to_bpl BOOLEAN DEFAULT false;
        RAISE NOTICE 'Column belongs_to_bpl added to job_cards table';
    ELSE
        RAISE NOTICE 'Column belongs_to_bpl already exists in job_cards table';
    END IF;
END $$;

-- Add state column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'job_cards' AND column_name = 'state') THEN
        ALTER TABLE job_cards ADD COLUMN state VARCHAR(100);
        RAISE NOTICE 'Column state added to job_cards table';
    ELSE
        RAISE NOTICE 'Column state already exists in job_cards table';
    END IF;
END $$;

-- Add village column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'job_cards' AND column_name = 'village') THEN
        ALTER TABLE job_cards ADD COLUMN village VARCHAR(255);
        RAISE NOTICE 'Column village added to job_cards table';
    ELSE
        RAISE NOTICE 'Column village already exists in job_cards table';
    END IF;
END $$;

-- Add panchayat column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'job_cards' AND column_name = 'panchayat') THEN
        ALTER TABLE job_cards ADD COLUMN panchayat VARCHAR(255);
        RAISE NOTICE 'Column panchayat added to job_cards table';
    ELSE
        RAISE NOTICE 'Column panchayat already exists in job_cards table';
    END IF;
END $$;

-- Add block column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'job_cards' AND column_name = 'block') THEN
        ALTER TABLE job_cards ADD COLUMN block VARCHAR(255);
        RAISE NOTICE 'Column block added to job_cards table';
    ELSE
        RAISE NOTICE 'Column block already exists in job_cards table';
    END IF;
END $$;

-- Add full_address column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'job_cards' AND column_name = 'full_address') THEN
        ALTER TABLE job_cards ADD COLUMN full_address TEXT;
        RAISE NOTICE 'Column full_address added to job_cards table';
    ELSE
        RAISE NOTICE 'Column full_address already exists in job_cards table';
    END IF;
END $$;

-- Add bank_name column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'job_cards' AND column_name = 'bank_name') THEN
        ALTER TABLE job_cards ADD COLUMN bank_name VARCHAR(255);
        RAISE NOTICE 'Column bank_name added to job_cards table';
    ELSE
        RAISE NOTICE 'Column bank_name already exists in job_cards table';
    END IF;
END $$;

-- Add account_number column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'job_cards' AND column_name = 'account_number') THEN
        ALTER TABLE job_cards ADD COLUMN account_number VARCHAR(50);
        RAISE NOTICE 'Column account_number added to job_cards table';
    ELSE
        RAISE NOTICE 'Column account_number already exists in job_cards table';
    END IF;
END $$;

-- Add ifsc_code column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'job_cards' AND column_name = 'ifsc_code') THEN
        ALTER TABLE job_cards ADD COLUMN ifsc_code VARCHAR(20);
        RAISE NOTICE 'Column ifsc_code added to job_cards table';
    ELSE
        RAISE NOTICE 'Column ifsc_code already exists in job_cards table';
    END IF;
END $$;

-- Add image_url column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'job_cards' AND column_name = 'image_url') THEN
        ALTER TABLE job_cards ADD COLUMN image_url VARCHAR(500);
        RAISE NOTICE 'Column image_url added to job_cards table';
    ELSE
        RAISE NOTICE 'Column image_url already exists in job_cards table';
    END IF;
END $$;

COMMIT;

-- Display success message
SELECT 'Migration completed successfully!' AS status;