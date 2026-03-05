#!/bin/bash

# Post-deploy migration script for Render
# This script runs database migrations after deployment

echo "Starting post-deployment migrations..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "Error: DATABASE_URL is not set"
    exit 1
fi

echo "Database URL found, connecting..."

# Run the migration script
echo "Running job_cards table migration..."
psql "$DATABASE_URL" -f ./migrations/add_tracking_id_to_job_card_applications.sql

if [ $? -eq 0 ]; then
    echo "✅ Migration completed successfully!"
else
    echo "❌ Migration failed!"
    exit 1
fi

echo "All migrations completed."