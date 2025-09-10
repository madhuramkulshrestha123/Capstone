// Simple script to check database connection
const { PrismaClient } = require('@prisma/client');

async function checkDatabaseConnection() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Checking database connection...');
    await prisma.$connect();
    console.log('✅ Successfully connected to the database');
    
    // Try a simple query
    try {
      await prisma.$queryRaw`SELECT 1`;
      console.log('✅ Database query successful');
      console.log('\nNote: This connection test uses Prisma Accelerate for runtime operations.');
      console.log('For running migrations, you still need a direct database connection.');
    } catch (queryError) {
      console.log('❌ Database query failed:', queryError.message);
    }
    
  } catch (error) {
    console.log('❌ Failed to connect to the database:', error.message);
    console.log('\nTroubleshooting tips:');
    console.log('1. Check your DATABASE_URL in the .env file');
    console.log('2. If using Prisma Accelerate, ensure your API key is valid');
    console.log('3. For migrations, you need a direct database connection');
    console.log('4. Check that your firewall allows connections');
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabaseConnection();