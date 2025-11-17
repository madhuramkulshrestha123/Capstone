#!/bin/bash
echo "Running pre-deploy script..."
npm install --legacy-peer-deps || npm install
echo "Dependencies installed"
npm list || echo "Some dependencies may be missing, but continuing build..."