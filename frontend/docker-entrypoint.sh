#!/bin/sh
# Script para verificar variables de entorno del frontend

echo "======================================"
echo "FRONTEND - VARIABLES DE ENTORNO"
echo "======================================"
echo "REACT_APP_API_URL: $REACT_APP_API_URL"
echo "REACT_APP_PAYPAL_CLIENT_ID: $([ -z "$REACT_APP_PAYPAL_CLIENT_ID" ] && echo 'NO DEFINIDA' || echo 'DEFINIDA')"
echo "======================================"
echo ""

set -e
cd /app

if [ ! -d "node_modules" ]; then
  echo "Instalando dependencias..."
  npm install --no-save
fi

echo "Iniciando frontend..."
SKIP_PREFLIGHT_CHECK=true npm start

