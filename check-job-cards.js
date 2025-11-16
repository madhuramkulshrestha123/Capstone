const { Client } = require('pg');

async function checkJobCards() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '12345678',
    database: 'capstone_db',
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Get all job cards
    const jobCards = await client.query('SELECT * FROM job_cards LIMIT 10;');
    
    console.log('Job cards found:', jobCards.rows.length);
    console.log('Job cards:', jobCards.rows);
    
    // Get all users
    const users = await client.query('SELECT * FROM users WHERE role = \'supervisor\' AND is_active = true LIMIT 10;');
    
    console.log('\nUsers found:', users.rows.length);
    console.log('Users:', users.rows);
    
    // Try to match users with job cards
    console.log('\nMatching users with job cards:');
    for (const user of users.rows) {
      const matchingJobCard = jobCards.rows.find(jobCard => jobCard.aadhaar_number === user.aadhaar_number);
      if (matchingJobCard) {
        console.log(`User ${user.name} (${user.aadhaar_number}) has job card ${matchingJobCard.job_card_id}`);
      } else {
        console.log(`User ${user.name} (${user.aadhaar_number}) has no matching job card`);
      }
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
    console.log('Database connection closed');
  }
}

checkJobCards().catch(console.error);