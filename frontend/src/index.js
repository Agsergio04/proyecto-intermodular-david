/**
 * Punto de entrada principal de la aplicación React.
 * Configura el renderizado del componente raíz con StrictMode y estilos globales.
 * 
 * @module main
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/index.css';
import App from './App';
import './api/i18n/config';

/**
 * Crea y configura el contenedor raíz de React 18.
 * Monta la aplicación en el elemento DOM con id 'root'.
 * 
 * @type {import('react-dom/client').Root}
 */
const root = ReactDOM.createRoot(document.getElementById('root'));

/**
 * Renderiza la aplicación completa con React.StrictMode.
 * StrictMode activa verificaciones adicionales en desarrollo:
 * - Detecta efectos secundarios inesperados
 * - Verifica uso deprecated de APIs
 * - Asegura componentes puros
 * 
 * @see {@link https://react.dev/reference/react/StrictMode|React.StrictMode}
 */
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);