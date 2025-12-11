/**
 * @fileoverview Componente reutilizable para mostrar tarjetas de estadísticas.
 * Usado en Dashboard y otras páginas para mostrar métricas en formato visual.
 * Soporta múltiples colores, iconos personalizados y tema oscuro/claro.
 * 
 * @module components/StatCard
 * @requires react
 * @requires ../assets/styles/StatCard.css
 */

import React from 'react';
import '../assets/styles/StatCard.css';

/**
 * Componente de tarjeta de estadística reutilizable.
 * 
 * Representa una métrica individual con título, valor, icono y color de fondo.
 * Se utiliza típicamente en un grid para mostrar múltiples estadísticas juntas.
 * 
 * Características:
 * - Soporta colores personalizados mediante className dinámico
 * - Icono flexible (puede ser cualquier elemento React, SVG, etc)
 * - Soporte para tema oscuro/claro
 * - Responsive y accesible
 * - Estructura semántica HTML (div con contenido estructurado)
 * 
 * @component
 * @param {Object} props - Props del componente
 * @param {string} props.title - Título o etiqueta de la estadística
 * @param {string|number} props.value - Valor a mostrar
 * @param {React.ReactElement} props.icon - Elemento icono
 * @param {string} props.color - Clase CSS de color
 * @param {boolean} props.isDark - Indica si tema oscuro está activo
 * 
 * @returns {React.ReactElement} Tarjeta de estadística formateada
 */
export const StatCard = ({ title, value, icon, color, isDark }) => {
  return (
    <div className={`stat-card ${color} ${isDark ? 'stat-card--dark-mode' : ''}`}>
      <div className="stat-card__content">
        <div>
          <p className="stat-card__title">{title}</p>
          <p className="stat-card__value">{value}</p>
        </div>
        <div className="stat-card__icon">{icon}</div>
      </div>
    </div>
  );
};
