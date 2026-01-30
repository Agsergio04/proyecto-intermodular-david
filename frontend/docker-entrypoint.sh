#!/bin/sh
set -e

cd /app

if [ ! -d "node_modules" ]; then
  echo "Installing frontend dependencies..."
  npm install --no-save
fi

echo "Starting frontend server..."
exec npm start
