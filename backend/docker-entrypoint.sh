#!/bin/sh
# Backend initialization script

cd /app

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
  echo "Installing backend dependencies..."
  npm install --no-save
fi

# Wait for MongoDB to be ready
echo "Waiting for MongoDB to be ready..."
sleep 5

# Start the server
npm start