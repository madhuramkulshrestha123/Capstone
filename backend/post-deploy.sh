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
node run-migrations.js quick-migration.sql

echo "========================================"
echo "✅ All migrations completed successfully!"
echo "========================================"