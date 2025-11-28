#!/bin/sh
# Backend initialization script

cd /app

# Instalar dependencias si node_modules no existe
if [ ! -d "node_modules" ]; then
  echo "Instalando dependencias del backend..."
  npm install --no-save
fi

# Esperar a que MongoDB esté listo
echo "Esperando a MongoDB..."
sleep 5

# Iniciar el servidor
npm start