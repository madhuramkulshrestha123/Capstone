-- Migration to fix job_cards table structure
-- Date: 2026-03-05
-- This migration ensures proper UUID primary key and adds job_card_number field

BEGIN;

-- Step 1: Drop the existing primary key constraint if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'job_cards_pkey') THEN
        ALTER TABLE job_cards DROP CONSTRAINT IF EXISTS job_cards_pkey;
        RAISE NOTICE 'Dropped existing primary key constraint';
    ELSE
        RAISE NOTICE 'Primary key constraint does not exist';
    END IF;
END $$;

-- Step 2: Change job_card_id column type to UUID if it's not already
DO $$ 
BEGIN
    -- Check if job_card_id is already UUID type
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'job_cards' 
        AND column_name = 'job_card_id'
        AND data_type = 'uuid'
    ) THEN
        -- First, drop any default value
        ALTER TABLE job_cards ALTER COLUMN job_card_id DROP DEFAULT;
        
        -- Convert existing values to UUID format if needed
        -- For any non-UUID values, we'll generate new UUIDs
        ALTER TABLE job_cards ALTER COLUMN job_card_id TYPE UUID USING 
            CASE 
                WHEN job_card_id ~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$' 
                THEN job_card_id::uuid
                ELSE gen_random_uuid()
            END;
        
        RAISE NOTICE 'Converted job_card_id to UUID type';
    ELSE
        RAISE NOTICE 'job_card_id is already UUID type';
    END IF;
END $$;

-- Step 3: Add job_card_number column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'job_cards' AND column_name = 'job_card_number') THEN
        ALTER TABLE job_cards ADD COLUMN job_card_number VARCHAR(50);
        RAISE NOTICE 'Column job_card_number added to job_cards table';
    ELSE
        RAISE NOTICE 'Column job_card_number already exists in job_cards table';
    END IF;
END $$;

-- Step 4: Set default value for job_card_id to auto-generate UUID
ALTER TABLE job_cards ALTER COLUMN job_card_id SET DEFAULT gen_random_uuid();

-- Step 5: Add primary key constraint on job_card_id
ALTER TABLE job_cards ADD CONSTRAINT job_cards_pkey PRIMARY KEY (job_card_id);

-- Step 6: Add unique constraint on job_card_number
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'job_cards_job_card_number_key') THEN
        ALTER TABLE job_cards ADD CONSTRAINT job_cards_job_card_number_key UNIQUE (job_card_number);
        RAISE NOTICE 'Added unique constraint on job_card_number';
    ELSE
        RAISE NOTICE 'Unique constraint on job_card_number already exists';
    END IF;
END $$;

-- Step 7: Create index on job_card_number for better query performance
CREATE INDEX IF NOT EXISTS idx_job_cards_job_card_number ON job_cards(job_card_number);

-- Step 8: Make job_card_number NOT NULL after ensuring all records have one
-- This will be done manually by updating existing records first
DO $$
BEGIN
    -- Update any NULL job_card_number values with generated ones
    UPDATE job_cards 
    SET job_card_number = 'JC' || EXTRACT(YEAR FROM NOW())::text || 
                          LPAD(EXTRACT(MONTH FROM NOW())::text, 2, '0') ||
                          LPAD(EXTRACT(DAY FROM NOW())::text, 2, '0') ||
                          LPAD(EXTRACT(HOUR FROM NOW())::text, 2, '0') ||
                          LPAD(EXTRACT(MINUTE FROM NOW())::text, 2, '0') ||
                          LPAD(EXTRACT(SECOND FROM NOW())::text, 2, '0') ||
                          LPAD(FLOOR(RANDOM() * 1000)::text, 3, '0')
    WHERE job_card_number IS NULL;
    
    RAISE NOTICE 'Updated NULL job_card_number values';
END $$;

-- Now make it NOT NULL
ALTER TABLE job_cards ALTER COLUMN job_card_number SET NOT NULL;

COMMIT;

-- Display success message
SELECT 'Migration completed successfully! job_cards table now has proper UUID primary key and job_card_number field.' AS status;
