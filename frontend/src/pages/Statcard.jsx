import React from 'react';
import '../assets/styles/StatCard.css';

/**
 * Tarjeta de estadística para mostrar métricas en el dashboard.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {string} props.title - Título o etiqueta de la métrica.
 * @param {string|number} props.value - Valor numérico o texto de la métrica.
 * @param {JSX.Element} props.icon - Icono que se mostrará en la tarjeta.
 * @param {string} props.color - Clase de color adicional para el fondo/estilo.
 * @param {boolean} props.isDark - Indica si se debe aplicar el tema oscuro.
 * @returns {JSX.Element} Tarjeta de estadística con título, valor e icono.
 */
export const StatCard = ({ title, value, icon, color, isDark }) => {
  return (
    <div className={`stat-card ${color} ${isDark ? 'stat-card--dark-mode' : ''}`}>
      <div className="stat-card__content">
        <div>
          <p className={`stat-card__title ${isDark ? 'stat-card__title--dark' : ''}`}>{title}</p>
          <p className={`stat-card__value ${isDark ? 'stat-card__value--dark' : ''}`}>{value}</p>
        </div>
        <div className={`stat-card__icon ${isDark ? 'stat-card__icon--dark' : ''}`}>{icon}</div>
      </div>
    </div>
  );
};
