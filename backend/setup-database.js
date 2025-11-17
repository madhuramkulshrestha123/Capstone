#!/usr/bin/env node

// Script to initialize the database schema
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

async function setupDatabase() {
  console.log('Setting up database...');
  
  // Check if DATABASE_URL is available
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL environment variable is not set');
    process.exit(1);
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
    const sqlFilePath = path.join(__dirname, 'init-neon-db.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');
    
    console.log('Executing database initialization script...');
    
    // Split the SQL into individual statements
    // We need to be careful with the splitting to handle multi-line statements
    const statements = [];
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
      if (statement.length === 0) {
        continue;
      }
      
      try {
        console.log(`Executing statement ${i+1}/${statements.length}:`, statement.substring(0, 50) + '...');
        await pool.query(statement);
        console.log(`Statement ${i+1} executed successfully`);
      } catch (error) {
        // Log the error but continue with other statements
        console.error(`Error executing statement ${i+1}:`, error.message);
        console.error('Statement:', statement);
        
        // For CREATE TABLE IF NOT EXISTS statements, we can ignore "already exists" errors
        if (!error.message.includes('already exists') && !error.message.includes('already been run')) {
          throw error;
        }
      }
    }
    
    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the setup
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase };