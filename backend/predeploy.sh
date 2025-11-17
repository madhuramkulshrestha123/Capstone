#!/bin/bash
echo "Running pre-deploy script..."
npm install --legacy-peer-deps || npm install
echo "Installing types..."
npm install @types/node
npm run build