import React from 'react';
import '../assets/styles/StatCard.css';

/**
 * Statistic card used to display metrics on the dashboard.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {string} props.title - Display label for the metric.
 * @param {string|number} props.value - Numeric or textual value for the metric.
 * @param {JSX.Element} props.icon - Icon to render inside the card.
 * @param {string} props.color - Additional color class for styling.
 * @param {boolean} props.isDark - Whether dark theme styles should be applied.
 * @returns {JSX.Element} A stat card showing title, value and icon.
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
