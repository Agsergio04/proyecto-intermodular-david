/**
 * @fileoverview Reusable statistic card component.
 * Used in Dashboard and other pages to display metric values visually.
 * Supports multiple color themes, custom icons and dark/light mode.
 *
 * @module components/StatCard
 * @requires react
 * @requires ../assets/styles/StatCard.css
 */

import React from 'react';
import '../assets/styles/StatCard.css';

/**
 * Reusable statistic card component.
 *
 * Represents a single metric with title, value, icon and background color.
 * Typically used in a grid to display multiple metrics.
 *
 * Features:
 * - Supports custom color classes via `color` prop
 * - Flexible `icon` prop (any React element or SVG)
 * - Supports dark/light theme variations
 * - Responsive and accessible
 *
 * @component
 * @param {Object} props
 * @param {string} props.title - Metric title
 * @param {string|number} props.value - Metric value
 * @param {React.ReactElement} props.icon - Icon element
 * @param {string} props.color - CSS color class
 * @param {boolean} props.isDark - Dark theme flag
 * @returns {React.ReactElement} Formatted statistic card
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
