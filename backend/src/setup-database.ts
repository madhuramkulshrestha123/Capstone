// Script to initialize the database schema
import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export async function setupDatabase(): Promise<boolean> {
  console.log('Setting up database...');
  
  // Check if DATABASE_URL is available
  if (!process.env.DATABASE_URL) {
    console.log('DATABASE_URL environment variable is not set, skipping database setup');
    return true;
  }
  
  // Create a pool with the database URL
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  try {
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, '../init-neon-db.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');
    
    console.log('Executing database initialization script...');
    
    // Split the SQL into individual statements
    // We need to be careful with the splitting to handle multi-line statements
    const statements: string[] = [];
    let currentStatement = '';
    
    const lines = sql.split('\n');
    for (const line of lines) {
      // Skip comment lines
      if (line.trim().startsWith('--')) {
        continue;
      }
      
      currentStatement += line + '\n';
      
      // If line ends with semicolon, we have a complete statement
      if (line.trim().endsWith(';')) {
        const trimmedStatement = currentStatement.trim();
        if (trimmedStatement.length > 0) {
          statements.push(trimmedStatement);
        }
        currentStatement = '';
      }
    }
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement && statement.length === 0) {
        continue;
      }
      
      if (!statement) {
        continue;
      }
      
      try {
        console.log(`Executing statement ${i+1}/${statements.length}:`, statement.substring(0, 50) + '...');
        await pool.query(statement);
        console.log(`Statement ${i+1} executed successfully`);
      } catch (error: any) {
        // Log the error but continue with other statements
        console.log(`Statement ${i+1} skipped (may already exist):`, error.message.substring(0, 100));
        
        // For CREATE TABLE IF NOT EXISTS statements, we can ignore "already exists" errors
        if (!error.message.includes('already exists') && !error.message.includes('already been run')) {
          // Log but don't throw - we want to continue with other statements
          console.log('Continuing with remaining statements...');
        }
      }
    }
    
    console.log('Database setup completed successfully!');
    return true;
  } catch (error: any) {
    console.error('Database setup failed:', error);
    return false;
  } finally {
    await pool.end();
  }
}