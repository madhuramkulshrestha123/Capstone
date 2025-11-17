const { Client } = require('pg');
const fs = require('fs').promises;

// Get database connection string from environment variable or use the Neon connection string you provided
const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_TUy0sgCA5lKH@ep-withered-block-a1h91z9p-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function setupDatabase() {
  const client = new Client({
    connectionString: connectionString,
  });

  try {
    // Connect to the database
    await client.connect();
    console.log('Connected to the database successfully');

    // Read the SQL file
    const sql = await fs.readFile('./init-neon-db.sql', 'utf8');
    
    // Split the SQL file into individual statements
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    // Execute each statement
    for (const statement of statements) {
      try {
        await client.query(statement);
        console.log('Executed statement successfully');
      } catch (error) {
        // Skip errors for CREATE INDEX IF NOT EXISTS and CREATE TRIGGER IF NOT EXISTS
        // as they might fail if the index/trigger already exists
        if (!error.message.includes('already exists') && !error.message.includes('duplicate key')) {
          console.error('Error executing statement:', error.message);
          console.error('Statement:', statement.substring(0, 100) + '...');
        }
      }
    }

    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await client.end();
  }
}

// Run the setup
setupDatabase();