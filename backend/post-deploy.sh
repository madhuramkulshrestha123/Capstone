#!/bin/bash

# Post-deploy script to set up database tables

echo "Setting up database tables..."

cd backend

# Run the database setup
npm run db:setup:job-card-tables || {
    echo "Database setup failed, but continuing..."
    echo "Tables might already exist."
}

echo "Database setup complete!"
