#!/bin/sh
# Frontend initialization script

cd /app

# Instalar dependencias si node_modules no existe
if [ ! -d "node_modules" ]; then
  echo "Instalando dependencias del frontend..."
  npm install --no-save
fi

# Iniciar el servidor
npm start
