#!/bin/bash

# Post-deploy migration script for Render
# This script runs database migrations after deployment

set -e  # Exit on error

echo "========================================"
echo "Starting post-deployment migrations..."
echo "========================================"

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  Warning: DATABASE_URL is not set, skipping migrations"
    exit 0
fi

echo "✅ Database URL found"

# Run migrations using Node.js script
echo "Running database migrations..."

# Run the job card applications migration first
node run-migrations.js add_tracking_id_to_job_card_applications.sql

# Run the job cards structure migration (fixes UUID issue)
node run-migrations.js fix_job_cards_structure.sql

# Run the attendance marked_by column migration
node run-migrations.js add_marked_by_to_attendance.sql

# Run the payment timestamps migration (adds paid_at, approved_at, approved_by columns)
node run-migrations.js database/migrations/add_payment_timestamps.sql

echo "========================================"
echo "✅ All migrations completed successfully!"
echo "========================================"