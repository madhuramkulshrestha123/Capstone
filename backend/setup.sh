#!/bin/bash

# Capstone Backend Setup Script

echo "🚀 Setting up Capstone Backend..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma Client
echo "⚡ Generating Prisma Client..."
npm run db:generate

# Check Database Connection
echo "🗄️  Please ensure your DATABASE_URL in .env is correctly configured..."

echo "📝 Please update your .env file with the correct DATABASE_URL (Prisma Accelerate recommended)."
echo "🔧 Then run 'npm run db:migrate' to deploy the database schema."
echo "🎉 Setup complete! Run 'npm run dev' to start the development server."