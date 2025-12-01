#!/bin/sh
set -e

cd /app

if [ ! -d "node_modules" ]; then
  echo "Installing backend dependencies..."
  npm install --no-save
fi

echo "Waiting for MongoDB..."
sleep 5

echo "Starting backend server..."
exec npm start

