// Script to create the OTP table manually
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createOtpTable() {
  try {
    // Since we can't run migrations with Prisma Accelerate,
    // we'll create the table using raw SQL
    
    console.log('Creating OTP table...');
    
    // Create the table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "otps" (
        "id" SERIAL NOT NULL,
        "email" VARCHAR(100) NOT NULL,
        "otp" VARCHAR(6) NOT NULL,
        "expires_at" TIMESTAMPTZ NOT NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "resend_count" INTEGER NOT NULL DEFAULT 0,
        "last_resend_at" TIMESTAMPTZ,
        "is_verified" BOOLEAN NOT NULL DEFAULT false,
        CONSTRAINT "otps_pkey" PRIMARY KEY ("id")
      )
    `;
    
    // Create indexes
    await prisma.$executeRaw`
      CREATE UNIQUE INDEX IF NOT EXISTS "otps_email_key" ON "otps"("email")
    `;
    
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS "otps_email_idx" ON "otps"("email")
    `;
    
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS "otps_expires_at_idx" ON "otps"("expires_at")
    `;
    
    console.log('✅ OTP table created successfully!');
  } catch (error) {
    console.error('❌ Error creating OTP table:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createOtpTable();