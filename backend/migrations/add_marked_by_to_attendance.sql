-- Migration to add marked_by column to attendance table
-- This column tracks which supervisor marked the attendance

-- Add marked_by column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'attendance' 
        AND column_name = 'marked_by'
    ) THEN
        ALTER TABLE attendance ADD COLUMN marked_by UUID;
        
        -- Add foreign key constraint to users table
        ALTER TABLE attendance 
        ADD CONSTRAINT attendance_marked_by_fkey 
        FOREIGN KEY (marked_by) REFERENCES users(user_id) ON DELETE SET NULL;
        
        -- Create index for better query performance
        CREATE INDEX idx_attendance_marked_by ON attendance(marked_by);
        
        RAISE NOTICE 'Column marked_by added to attendance table';
    ELSE
        RAISE NOTICE 'Column marked_by already exists in attendance table';
    END IF;
END $$;
