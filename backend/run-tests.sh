#!/bin/bash

echo "Capstone Backend API - Test Runner"
echo "=================================="

echo "1. Installing dependencies..."
npm install

echo "2. Running database migrations..."
npx prisma migrate dev

echo "3. Starting development server..."
npm run dev