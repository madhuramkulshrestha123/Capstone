-- Migration: Add payment timestamp columns
-- Adds paid_at, approved_at, and approved_by columns to payments table

-- Add paid_at column to payments table if it doesn't exist
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS paid_at TIMESTAMP;

-- Add approved_at column to payments table if it doesn't exist  
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP;

-- Add approved_by column to payments table if it doesn't exist
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS approved_by UUID;

-- Add comment to document the columns
COMMENT ON COLUMN payments.paid_at IS 'Timestamp when payment was marked as paid';
COMMENT ON COLUMN payments.approved_at IS 'Timestamp when payment was approved';
COMMENT ON COLUMN payments.approved_by IS 'UUID of admin who approved the payment';
