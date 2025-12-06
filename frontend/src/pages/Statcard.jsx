import React from 'react';
import '../assets/styles/StatCard.css';

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