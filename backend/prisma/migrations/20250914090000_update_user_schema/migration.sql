-- First, convert existing roles to match the new schema
UPDATE "public"."users" 
SET role = CASE 
  WHEN role = 'WORKER' THEN 'supervisor'
  WHEN role = 'SUPERVISOR' THEN 'supervisor'
  WHEN role = 'ADMIN' THEN 'admin'
  ELSE 'supervisor'
END;

-- Add new columns
ALTER TABLE "public"."users" 
ADD COLUMN IF NOT EXISTS "user_id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD COLUMN IF NOT EXISTS "name" VARCHAR(255),
ADD COLUMN IF NOT EXISTS "phone_number" VARCHAR(20),
ADD COLUMN IF NOT EXISTS "aadhaar_number" VARCHAR(20),
ADD COLUMN IF NOT EXISTS "panchayat_id" UUID,
ADD COLUMN IF NOT EXISTS "government_id" VARCHAR(100),
ADD COLUMN IF NOT EXISTS "state" VARCHAR(100),
ADD COLUMN IF NOT EXISTS "district" VARCHAR(100),
ADD COLUMN IF NOT EXISTS "village_name" VARCHAR(100),
ADD COLUMN IF NOT EXISTS "pincode" VARCHAR(10);

-- Combine first_name and last_name into name
UPDATE "public"."users" 
SET name = CONCAT(first_name, ' ', last_name)
WHERE first_name IS NOT NULL OR last_name IS NOT NULL;

-- Set default values for required fields where needed
UPDATE "public"."users" 
SET name = username 
WHERE name IS NULL OR name = '';

-- Make sure all required fields have values
UPDATE "public"."users" 
SET phone_number = '0000000000' 
WHERE phone_number IS NULL;

UPDATE "public"."users" 
SET aadhaar_number = '000000000000' 
WHERE aadhaar_number IS NULL;

UPDATE "public"."users" 
SET government_id = 'GOV000000' 
WHERE government_id IS NULL;

UPDATE "public"."users" 
SET state = 'Unknown' 
WHERE state IS NULL;

UPDATE "public"."users" 
SET district = 'Unknown' 
WHERE district IS NULL;

UPDATE "public"."users" 
SET village_name = 'Unknown' 
WHERE village_name IS NULL;

UPDATE "public"."users" 
SET pincode = '000000' 
WHERE pincode IS NULL;

UPDATE "public"."users" 
SET panchayat_id = gen_random_uuid() 
WHERE panchayat_id IS NULL;

-- Remove old columns that are not in the new schema
ALTER TABLE "public"."users" 
DROP COLUMN IF EXISTS "id",
DROP COLUMN IF EXISTS "username",
DROP COLUMN IF EXISTS "first_name",
DROP COLUMN IF EXISTS "last_name",
DROP COLUMN IF EXISTS "avatar_url";

-- Add constraints
ALTER TABLE "public"."users"
ALTER COLUMN "role" TYPE VARCHAR(20),
ALTER COLUMN "role" SET NOT NULL;

-- Add check constraint for role
ALTER TABLE "public"."users"
ADD CONSTRAINT "users_role_check" CHECK ("role" IN ('supervisor', 'admin'));

-- Add unique constraints
ALTER TABLE "public"."users"
ADD CONSTRAINT "users_phone_number_key" UNIQUE ("phone_number"),
ADD CONSTRAINT "users_aadhaar_number_key" UNIQUE ("aadhaar_number"),
ADD CONSTRAINT "users_government_id_key" UNIQUE ("government_id");

-- Add primary key
ALTER TABLE "public"."users"
DROP CONSTRAINT IF EXISTS "users_pkey",
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("user_id");