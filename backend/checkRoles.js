const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'Capstone',
  password: 'Madhuram@123',
  port: 5432,
});

async function checkRoles() {
  try {
    await client.connect();
    const res = await client.query('SELECT DISTINCT role FROM users;');
    console.log('Current roles in the database:');
    res.rows.forEach(row => {
      console.log(`- ${row.role}`);
    });
    
    // Also check the current structure of the users table
    const structure = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position;
    `);
    console.log('\nCurrent users table structure:');
    structure.rows.forEach(row => {
      console.log(`${row.column_name} (${row.data_type}, ${row.is_nullable})`);
    });
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

checkRoles();