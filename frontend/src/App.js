/**
 * @fileoverview Componente principal de la aplicación.
 * Configura el router con React Router, inicializa los stores globales,
 * maneja rutas públicas y protegidas, e integra el Header y notificaciones.
 * 
 * @module App
 */

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuthStore, useThemeStore, useLanguageStore } from './store';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Interviews from './pages/Interviews';
import InterviewSession from './pages/InterviewSession';
import Subscription from './pages/Subscription';
import Settings from './pages/Settings';

// Components
import Header from './components/Header';

/**
 * Componente de ruta protegida.
 * Redirige a login si el usuario no tiene token válido.
 * 
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componente a renderizar si usuario autenticado
 * @returns {React.ReactElement} Elemento JSX (componente hijo o redirección a login)
 * 
 * @example
 * <ProtectedRoute>
 *   <Dashboard />
 * </ProtectedRoute>
 */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

/**
 * Componente principal de la aplicación.
 * Proporciona:
 * - Sistema de enrutamiento con React Router
 * - Inicialización de stores globales (autenticación, tema, idioma)
 * - Header navegable en todas las páginas
 * - Manejo de rutas públicas y protegidas
 * - Sistema de notificaciones con React Toastify
 * 
 * **Flujo de inicialización:**
 * 1. En el useEffect, inicializa autenticación desde localStorage
 * 2. Aplica tema oscuro si estaba guardado
 * 3. Carga idioma guardado (por defecto: inglés)
 * 4. Renderiza Router con todas las rutas
 * 
 * **Rutas disponibles:**
 * - Públicas: / (Home), /login, /register
 * - Protegidas: /dashboard, /interviews, /interview/:interviewId, /subscription, /settings
 * 
 * @component
 * @returns {React.ReactElement} Elemento JSX con router y estructura principal
 * 
 * @example
 * // index.js
 * import App from './App';
 * ReactDOM.render(<App />, document.getElementById('root'));
 */
function App() {
  // Destructura funciones de inicialización de los stores globales
  const { initializeAuth } = useAuthStore();
  const { initializeTheme } = useThemeStore();
  const { initializeLanguage } = useLanguageStore();

  /**
   * Inicializa estado global de la aplicación.
   * Se ejecuta una sola vez al montar el componente.
   * 
   * @sideEffect:
   * - Restaura sesión de usuario desde localStorage
   * - Aplica tema oscuro si estaba guardado
   * - Carga idioma preferido guardado
   */
  useEffect(() => {
    initializeAuth();
    initializeTheme();
    initializeLanguage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Router>
      <div className="min-h-screen transition-colors">
        {/* Header con navegación disponible en todas las páginas */}
        <Header />
        
        {/* Sistema de rutas de la aplicación */}
        <Routes>
          {/* ===== Rutas Públicas ===== */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ===== Rutas Protegidas (requieren autenticación) ===== */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interviews"
            element={
              <ProtectedRoute>
                <Interviews />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview/:interviewId"
            element={
              <ProtectedRoute>
                <InterviewSession />
              </ProtectedRoute>
            }
          />
          <Route
            path="/subscription"
            element={
              <ProtectedRoute>
                <Subscription />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
        </Routes>

        {/* Sistema de notificaciones toast para feedback al usuario */}
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </Router>
  );
}

export default App;
