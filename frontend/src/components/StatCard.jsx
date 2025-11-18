import React from 'react';
import '../assets/styles/StatCard.css';

export const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className={`stat-card ${color}`}>
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