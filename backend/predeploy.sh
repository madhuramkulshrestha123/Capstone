#!/bin/bash
echo "Running pre-deploy script..."
npm install --legacy-peer-deps || npm install
echo "Build dependencies installed"
npm run build
echo "Build completed"